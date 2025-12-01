import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function GET(
	request: NextRequest,
	context: RouteContext
) {
	try {
		const { id } = await context.params
		const supabase = createClient()

		// Check if user is authenticated
		const { data: { session }, error: authError } = await supabase.auth.getSession()

		if (authError || !session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { data: post, error } = await supabase
			.from('posts')
			.select('*')
			.eq('id', id)
			.single()

		if (error) throw error
		return NextResponse.json(post)
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export async function PUT(
	request: NextRequest,
	context: RouteContext
) {
	try {
		const { id } = await context.params
		const supabase = createClient()

		// Check if user is authenticated
		const { data: { session }, error: authError } = await supabase.auth.getSession()

		if (authError || !session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { title, slug, content, excerpt, published } = body

		const postData = {
			title,
			slug,
			content,
			excerpt,
			published,
			updated_at: new Date().toISOString(),
			...(published && { published_at: new Date().toISOString() })
		}

		const { data, error } = await supabase
			.from('posts')
			.update(postData)
			.eq('id', id)
			.select()
			.single()

		if (error) throw error
		return NextResponse.json(data)
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export async function DELETE(
	request: NextRequest,
	context: RouteContext
) {
	try {
		const { id } = await context.params
		const supabase = createClient()

		// Check if user is authenticated
		const { data: { session }, error: authError } = await supabase.auth.getSession()

		if (authError || !session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { error } = await supabase
			.from('posts')
			.delete()
			.eq('id', id)

		if (error) throw error
		return NextResponse.json({ success: true })
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}
