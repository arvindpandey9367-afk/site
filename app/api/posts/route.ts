import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
	try {
		const { data: posts, error } = await supabase
			.from('posts')
			.select('*')
			.eq('published', true)
			.order('published_at', { ascending: false })
			.order('created_at', { ascending: false })

		if (error) {
			console.error('Database error:', error)
			return NextResponse.json([], { status: 200 })
		}

		return NextResponse.json(posts || [])
	} catch (error: any) {
		console.error('Unexpected error:', error)
		return NextResponse.json([], { status: 200 })
	}
}
