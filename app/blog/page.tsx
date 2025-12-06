import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar, ArrowLeft, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { PostSummary } from '@/types/post'
import { createPublicClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Server component to fetch posts
async function getPosts(): Promise<PostSummary[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, featured_image, published_at, created_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch posts:', error)
      return []
    }

    return (data as PostSummary[]) || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

const getPostDate = (post: PostSummary) =>
  post.published_at ?? post.created_at ?? new Date().toISOString()

export default async function BlogPage() {
  const posts = await getPosts()
  const getCardImage = (src?: string | null, alt?: string) => (
    <div className=" w-full">
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center">
        {src ? (
          <Image
            src={src}
            alt={alt || 'Blog featured image'}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="text-sm text-muted-foreground">No image provided</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-8 ">
            <h1 className="py-2 text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Blog & Articles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about web development, design, and technology
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Arvind Pandey</span>
            </span>
            <span>•</span>
            <span>{posts.length} Articles</span>
          </div>
        </div>

        {/* Featured Post (if any) */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Featured</h2>
            <Link href={`/blog/${posts[0].slug}`} className="block group">
              <Card className="overflow-hidden justify-center border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <div className="md:flex">
                  <div className="md:w-2/3 p-6 md:p-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(getPostDate(posts[0])), 'MMMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getReadingTime(posts[0].excerpt)} min read
                      </span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl mb-3 group-hover:text-primary transition-colors">
                      {posts[0].title}
                    </CardTitle>
                    <CardDescription className="text-lg mb-6">
                      {posts[0].excerpt}
                    </CardDescription>
                    <div className={buttonVariants()}>
                      Read Full Article
                    </div>
                  </div>
                  <div className="justify-center pr-7 py-1 md:w-1/3">{getCardImage(posts[0].featured_image, posts[0].title)}</div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* All Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">All Articles</h2>
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
                  <Card
                    className="h-full group-hover:shadow-xl transition-all duration-300 border hover:border-primary/30 overflow-hidden"
                  >
                    <CardHeader>
                      {getCardImage(post.featured_image, post.title)}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          Article {index + 2}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getReadingTime(post.excerpt)} min
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(getPostDate(post)), 'MMM d, yyyy')}
                        </span>
                        <div className={buttonVariants({ variant: "ghost", size: "sm", className: "group-hover:text-primary" })}>
                          Read →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for new articles and tutorials.
              </p>
              <Button asChild>
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}

      </div>
    </div>
  )
}
