export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const MCP_TOOLS = [
  {
    name: 'list_vendors',
    description: 'List all vendors with their compliance status',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['approved', 'partial', 'blocked', 'overdue'],
          description: 'Filter by status',
        },
      },
    },
  },
  {
    name: 'get_vendor',
    description: 'Get a single vendor by ID with full requirement details',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: { type: 'string', description: 'The vendor UUID' },
      },
      required: ['vendor_id'],
    },
  },
  {
    name: 'check_compliance',
    description: 'Check if a specific vendor is compliant and payment-cleared',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: { type: 'string', description: 'The vendor UUID' },
      },
      required: ['vendor_id'],
    },
  },
  {
    name: 'get_stats',
    description: 'Get aggregate compliance statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
]

async function handleToolCall(name: string, args: Record<string, unknown>) {
  const supabase = createServiceClient()

  switch (name) {
    case 'list_vendors': {
      let query = supabase.from('vendors').select('*, requirements(*)')
      if (args.status) {
        query = query.eq('status', args.status as string)
      }
      const { data, error } = await query
      if (error) throw error
      return { vendors: data }
    }

    case 'get_vendor': {
      const { data, error } = await supabase
        .from('vendors')
        .select('*, requirements(*)')
        .eq('id', args.vendor_id as string)
        .single()
      if (error) throw error
      return { vendor: data }
    }

    case 'check_compliance': {
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*, requirements(*)')
        .eq('id', args.vendor_id as string)
        .single()
      if (error) throw error
      const isCompliant = vendor.status === 'approved'
      const pendingRequirements = vendor.requirements?.filter(
        (r: { status: string }) => r.status !== 'approved'
      ) ?? []
      return {
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        is_compliant: isCompliant,
        payment_cleared: isCompliant,
        status: vendor.status,
        pending_requirements: pendingRequirements.map((r: { type: string; status: string }) => ({ type: r.type, status: r.status })),
      }
    }

    case 'get_stats': {
      const { data: vendors, error } = await supabase.from('vendors').select('status')
      if (error) throw error
      const total = vendors.length
      const approved = vendors.filter(v => v.status === 'approved').length
      const overdue = vendors.filter(v => v.status === 'overdue').length
      const blocked = vendors.filter(v => v.status === 'blocked').length
      const partial = vendors.filter(v => v.status === 'partial').length
      return {
        total_vendors: total,
        compliance_rate: total > 0 ? Math.round((approved / total) * 100) : 0,
        approved,
        partial,
        blocked,
        overdue,
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { jsonrpc, method, params, id } = body

  if (jsonrpc !== '2.0') {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
      id: null,
    })
  }

  try {
    let result: unknown

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'vendorgate-mcp', version: '1.0.0' },
        }
        break

      case 'tools/list':
        result = { tools: MCP_TOOLS }
        break

      case 'tools/call': {
        const toolName = params?.name as string
        const toolArgs = (params?.arguments ?? {}) as Record<string, unknown>

        // Log usage
        const supabase = createServiceClient()
        await supabase.from('mcp_usage').insert({
          tool: toolName,
          input: toolArgs,
        })

        const toolResult = await handleToolCall(toolName, toolArgs)

        // Update usage log with output
        result = {
          content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }],
        }
        break
      }

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${method}` },
          id,
        })
    }

    return NextResponse.json({ jsonrpc: '2.0', result, id })
  } catch (err) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: err instanceof Error ? err.message : 'Internal error',
      },
      id,
    })
  }
}
