import { notFound } from 'next/navigation'
import PostEditor from '../editor'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/post'

interface PageProps {
	params: {
		id: string
	}
}

const mapPostToEditorData = (post: Post) => ({
	id: post.id?.toString(),
	title: post.title ?? '',
	slug: post.slug ?? '',
	content: post.content ?? '',
	excerpt: post.excerpt ?? '',
	published: Boolean(post.published),
})

export default async function EditPostPage({ params }: PageProps) {
	const supabase = createClient()
	const { data: post, error } = await supabase
		.from('posts')
		.select('*')
		.eq('id', params.id)
		.single<Post>()

	if (error) {
		if (error.code === 'PGRST116') {
			notFound()
		}
		throw new Error(error.message ?? 'Failed to load post')
	}

	if (!post) {
		notFound()
	}

	return <PostEditor initialData={mapPostToEditorData(post)} isEditing />
}
