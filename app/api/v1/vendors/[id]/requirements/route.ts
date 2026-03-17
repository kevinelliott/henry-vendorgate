export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  return user?.id ?? null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: requirements, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('vendor_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ requirements })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { requirementId, status } = body

  if (!requirementId || !status) {
    return NextResponse.json({ error: 'requirementId and status are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: requirement, error } = await supabase
    .from('requirements')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requirementId)
    .eq('vendor_id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update vendor status based on requirements
  const { data: allRequirements } = await supabase
    .from('requirements')
    .select('status')
    .eq('vendor_id', id)

  if (allRequirements) {
    const allApproved = allRequirements.every(r => r.status === 'approved')
    const anyApproved = allRequirements.some(r => r.status === 'approved')
    const newStatus = allApproved ? 'approved' : anyApproved ? 'partial' : 'blocked'

    await supabase
      .from('vendors')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  return NextResponse.json({ requirement })
}
