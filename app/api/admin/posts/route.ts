import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
	try {
		// Get session from cookies
		const authHeader = request.headers.get('Authorization')

		if (!authHeader) {
			// Try to get session from cookie
			const sessionCookie = request.cookies.get('sb-access-token')

			if (!sessionCookie) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}
		}

		// For now, let's skip auth check for development
		// In production, you should verify the session properly
		const supabase = createClient()
		const { data: posts, error } = await supabase
			.from('posts')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			console.error('Database error:', error)
			return NextResponse.json([], { status: 200 })
		}

		return NextResponse.json(posts || [])
	} catch (error) {
		console.error('Unexpected error:', error)
		return NextResponse.json([], { status: 200 })
	}
}

export async function POST(request: NextRequest) {
	try {
		// For development, skip auth check
		// In production, add proper authentication

		const supabase = createClient()
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
			slug: slugify(slug || title),
			content,
			excerpt: excerpt || '',
			published: published || false,
			published_at: published ? new Date().toISOString() : null,
			updated_at: new Date().toISOString()
		}

		const { data, error } = await supabase
			.from('posts')
			.insert([postData])
			.select()
			.single()

		if (error) {
			console.error('Insert error:', error)
			return NextResponse.json(
				{ error: error.message || 'Failed to create post' },
				{ status: 500 }
			)
		}

		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
