import { createServiceClient } from '@/lib/supabase'

export async function seedDemoData(userId: string) {
  const supabase = createServiceClient()

  const vendors = [
    {
      user_id: userId,
      name: 'Acme Supplies LLC',
      email: 'ap@acmesupplies.com',
      phone: '555-0101',
      status: 'approved',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      name: 'TechPro Services',
      email: 'billing@techpro.com',
      phone: '555-0102',
      status: 'approved',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      name: 'Creative Agency Co',
      email: 'finance@creativeagency.co',
      phone: '555-0103',
      status: 'partial',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      name: 'FastShip Logistics',
      email: 'accounts@fastship.com',
      phone: '555-0104',
      status: 'overdue',
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      name: 'NewVendor Inc',
      email: 'info@newvendor.com',
      phone: '555-0105',
      status: 'blocked',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const { data: insertedVendors, error: vendorError } = await supabase
    .from('vendors')
    .insert(vendors)
    .select()

  if (vendorError) throw vendorError

  const requirementTypes = ['w9', 'coi', 'terms', 'bank', 'license'] as const

  for (const vendor of insertedVendors) {
    let completedCount = 0
    if (vendor.status === 'approved') completedCount = 5
    else if (vendor.status === 'partial') completedCount = 3
    else if (vendor.status === 'overdue') completedCount = 2
    else completedCount = 0

    const requirements = requirementTypes.map((type, index) => ({
      vendor_id: vendor.id,
      type,
      required: true,
      status: index < completedCount ? 'approved' : 'pending',
      submitted_at: index < completedCount ? new Date().toISOString() : null,
      reviewed_at: index < completedCount ? new Date().toISOString() : null,
    }))

    await supabase.from('requirements').insert(requirements)
  }

  return insertedVendors
}
