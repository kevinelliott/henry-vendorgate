export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServiceClient()
  const { data: vendors } = await supabase.from('vendors').select('status')
  const { data: users } = await supabase.auth.admin.listUsers()

  return NextResponse.json({
    vendors: vendors?.length ?? 0,
    users: users?.users?.length ?? 0,
  })
}
