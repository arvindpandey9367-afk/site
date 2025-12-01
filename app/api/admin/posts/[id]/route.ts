import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Params {
	params: {
		id: string
	}
}

export async function GET(
	request: NextRequest,
	{ params }: Params
) {
	try {
		const { data: post, error } = await supabase
			.from('posts')
			.select('*')
			.eq('id', params.id)
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json(
					{ error: 'Post not found' },
					{ status: 404 }
				)
			}
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(post)
	} catch (error: any) {
		console.error('Error fetching post:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch post' },
			{ status: 500 }
		)
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: Params
) {
	try {
		const body = await request.json()
		const { title, slug, content, excerpt, published } = body

		// Validate required fields
		if (!title || !slug || !content) {
			return NextResponse.json(
				{ error: 'Title, slug, and content are required' },
				{ status: 400 }
			)
		}

		const postData = {
			title,
			slug,
			content,
			excerpt: excerpt || '',
			published: published || false,
			updated_at: new Date().toISOString(),
			...(published && !body.published_at ? { published_at: new Date().toISOString() } : {})
		}

		const { data, error } = await supabase
			.from('posts')
			.update(postData)
			.eq('id', params.id)
			.select()
			.single()

		if (error) {
			console.error('Update error:', error)
			return NextResponse.json(
				{ error: error.message || 'Failed to update post' },
				{ status: 500 }
			)
		}

		return NextResponse.json(data)
	} catch (error: any) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: Params
) {
	try {
		const { error } = await supabase
			.from('posts')
			.delete()
			.eq('id', params.id)

		if (error) {
			console.error('Delete error:', error)
			return NextResponse.json(
				{ error: error.message || 'Failed to delete post' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
