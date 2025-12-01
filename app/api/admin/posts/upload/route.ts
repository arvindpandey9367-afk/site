import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_POSTS_BUCKET || 'post-images'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = createRouteClient(request)
    const extensionFromName = file.name?.split('.').pop()
    const extensionFromType = file.type?.split('/').pop()
    const extension = (extensionFromName || extensionFromType || 'png').toLowerCase()
    const filePath = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || 'image/png',
    })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return NextResponse.json({ url: data.publicUrl })
  } catch (error) {
    console.error('Unexpected upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

