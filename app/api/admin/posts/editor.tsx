// Remove this import from the top
// import { supabase } from '@/lib/supabase'

// In handleSubmit function, update the fetch call:
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
