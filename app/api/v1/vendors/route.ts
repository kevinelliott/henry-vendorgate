export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getSupabase } from '@/lib/supabase'

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  return user?.id ?? null
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: vendors, error } = await supabase
    .from('vendors')
    .select('*, requirements(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vendors })
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, email, phone, deadline } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .insert({
      user_id: userId,
      name,
      email,
      phone: phone || null,
      deadline: deadline || null,
      status: 'blocked',
    })
    .select()
    .single()

  if (vendorError) {
    return NextResponse.json({ error: vendorError.message }, { status: 500 })
  }

  // Create default requirements
  const requirementTypes = ['w9', 'coi', 'terms', 'bank', 'license']
  const requirements = requirementTypes.map(type => ({
    vendor_id: vendor.id,
    type,
    required: true,
    status: 'pending',
  }))

  await supabase.from('requirements').insert(requirements)

  return NextResponse.json({ vendor }, { status: 201 })
}
