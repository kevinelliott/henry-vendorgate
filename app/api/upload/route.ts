export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const vendorId = formData.get('vendor_id') as string
  const requirementType = formData.get('requirement_type') as string

  if (!file || !vendorId || !requirementType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Verify vendor exists
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('id')
    .eq('id', vendorId)
    .single()

  if (vendorError || !vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${vendorId}/${requirementType}-${Date.now()}.${fileExt}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  // Upload to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    // If bucket doesn't exist, try to create it
    if (uploadError.message.includes('Bucket not found')) {
      await supabase.storage.createBucket('documents', { public: false })
      const { error: retryError } = await supabase.storage
        .from('documents')
        .upload(fileName, buffer, { contentType: file.type, upsert: true })
      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Update the requirement
  const { error: reqError } = await supabase
    .from('requirements')
    .update({
      status: 'submitted',
      file_url: urlData.publicUrl,
      submitted_at: new Date().toISOString(),
    })
    .eq('vendor_id', vendorId)
    .eq('type', requirementType)

  if (reqError) {
    return NextResponse.json({ error: reqError.message }, { status: 500 })
  }

  // Check if vendor should be marked as partial or approved
  const { data: allReqs } = await supabase
    .from('requirements')
    .select('status')
    .eq('vendor_id', vendorId)

  if (allReqs) {
    const allSubmittedOrApproved = allReqs.every(r => r.status === 'submitted' || r.status === 'approved')
    const anySubmittedOrApproved = allReqs.some(r => r.status === 'submitted' || r.status === 'approved')
    const newStatus = anySubmittedOrApproved ? 'partial' : 'blocked'

    if (anySubmittedOrApproved) {
      await supabase
        .from('vendors')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', vendorId)
    }
  }

  return NextResponse.json({ success: true, file_url: urlData.publicUrl })
}
