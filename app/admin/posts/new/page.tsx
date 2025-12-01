'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function NewPostPage() {
	const router = useRouter()
	const { user, loading: authLoading } = useAuth()
	const [formData, setFormData] = useState({
		title: '',
		slug: '',
		content: '',
		excerpt: '',
		published: false,
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login')
		}
	}, [user, authLoading, router])

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			console.log('Submitting post:', formData)

			const response = await fetch('/api/admin/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || `Failed to create post (${response.status})`)
			}

			console.log('Post created successfully:', data)
			router.push('/admin/dashboard')
		} catch (error) {
			console.error('Error creating post:', error)
			const message = error instanceof Error ? error.message : 'An unexpected error occurred'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Button variant="ghost" onClick={() => router.back()} className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>
						<h1 className="text-2xl font-bold">Create New Post</h1>
						<div></div>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 py-8">
				<Card>
					<CardHeader>
						<CardTitle>Post Details</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="p-4 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
									<strong>Error:</strong> {error}
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="title">
									Title <span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => {
										const newTitle = e.target.value
										setFormData({
											...formData,
											title: newTitle,
											slug: generateSlug(newTitle)
										})
									}}
									required
									placeholder="Enter post title"
									disabled={loading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="slug">
									Slug <span className="text-destructive">*</span>
								</Label>
								<Input
									id="slug"
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									required
									placeholder="post-slug"
									disabled={loading}
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
									disabled={loading}
								/>
								<p className="text-sm text-muted-foreground">
									A short summary that appears on the blog listing page
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="content">
									Content <span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="content"
									value={formData.content}
									onChange={(e) => setFormData({ ...formData, content: e.target.value })}
									rows={15}
									placeholder="# Write your post content here...

## Use Markdown formatting

- Bullet points
- **Bold text**
- *Italic text*

```javascript
// Code blocks
console.log('Hello World');
```"
									className="font-mono text-sm"
									required
									disabled={loading}
								/>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="published"
									checked={formData.published}
									onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
									disabled={loading}
								/>
								<Label htmlFor="published" className="cursor-pointer">
									Publish immediately
								</Label>
							</div>

							<div className="flex justify-end gap-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push('/admin/dashboard')}
									disabled={loading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating Post...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Create Post
										</>
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
