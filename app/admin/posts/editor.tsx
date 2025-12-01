'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

interface PostEditorProps {
	initialData?: {
		id?: string
		title: string
		slug: string
		content: string
		excerpt: string
		published: boolean
	}
	isEditing?: boolean
}

export default function PostEditor({ initialData, isEditing = false }: PostEditorProps) {
	const router = useRouter()
	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		slug: initialData?.slug || '',
		content: initialData?.content || '',
		excerpt: initialData?.excerpt || '',
		published: initialData?.published || false,
	})
	const [loading, setLoading] = useState(false)

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const url = isEditing && initialData?.id
				? `/api/admin/posts/${initialData.id}`
				: '/api/admin/posts'

			const method = isEditing ? 'PUT' : 'POST'

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				router.push('/admin/dashboard')
			} else {
				throw new Error('Failed to save post')
			}
		} catch (error) {
			console.error('Error saving post:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<Button variant="ghost" onClick={() => router.back()} className="mb-8">
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => {
									setFormData({
										...formData,
										title: e.target.value,
										slug: generateSlug(e.target.value)
									})
								}}
								required
								placeholder="Enter post title"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								value={formData.slug}
								onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
								required
								placeholder="post-slug"
							/>
							<p className="text-sm text-muted-foreground">
								This will be used in the URL: /blog/{formData.slug}
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="excerpt">Excerpt</Label>
							<Textarea
								id="excerpt"
								value={formData.excerpt}
								onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
								rows={3}
								placeholder="Brief description of the post"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) => setFormData({ ...formData, content: e.target.value })}
								rows={10}
								placeholder="Write your post content here..."
								className="font-mono"
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Switch
								id="published"
								checked={formData.published}
								onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
							/>
							<Label htmlFor="published">Publish immediately</Label>
						</div>

						<div className="flex justify-end">
							<Button type="submit" disabled={loading}>
								<Save className="mr-2 h-4 w-4" />
								{loading ? 'Saving...' : 'Save Post'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
