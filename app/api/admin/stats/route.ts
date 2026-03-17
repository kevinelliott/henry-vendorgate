export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServiceClient()

  const { data: vendors } = await supabase.from('vendors').select('status, created_at')
  const { data: requirements } = await supabase.from('requirements').select('status')
  const { data: mcpUsage } = await supabase.from('mcp_usage').select('tool, created_at')

  const total = vendors?.length ?? 0
  const approved = vendors?.filter(v => v.status === 'approved').length ?? 0

  return NextResponse.json({
    vendors: {
      total,
      approved,
      partial: vendors?.filter(v => v.status === 'partial').length ?? 0,
      blocked: vendors?.filter(v => v.status === 'blocked').length ?? 0,
      overdue: vendors?.filter(v => v.status === 'overdue').length ?? 0,
      compliance_rate: total > 0 ? Math.round((approved / total) * 100) : 0,
    },
    requirements: {
      total: requirements?.length ?? 0,
      approved: requirements?.filter(r => r.status === 'approved').length ?? 0,
      pending: requirements?.filter(r => r.status === 'pending').length ?? 0,
      submitted: requirements?.filter(r => r.status === 'submitted').length ?? 0,
    },
    mcp_usage: {
      total: mcpUsage?.length ?? 0,
      by_tool: mcpUsage?.reduce((acc: Record<string, number>, u) => {
        acc[u.tool] = (acc[u.tool] || 0) + 1
        return acc
      }, {}),
    },
  })
}
