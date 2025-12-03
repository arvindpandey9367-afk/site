import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Github, Linkedin, ArrowRight, Calendar, Clock, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { format } from 'date-fns'
import { PostSummary } from '@/types/post'
import { createPublicClient } from '@/lib/supabase/server'
import Image from 'next/image'

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
      .limit(3) // Only fetch 3 latest posts for the home page

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

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-15 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-6">
              {/* <User className="h-12 w-12 text-primary" /> */}
              <Image src={"/img0.jpg"} alt='pp' height={300} width={300} className='rounded-full object-cover' />
            </div>
            <h1 className="text-5xl font-bold mb-4">Arvind Pandey</h1>
            <p className="text-xl text-muted-foreground mb-8">
              IT lecturer and Tech consultant
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/blog">View Blog</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-22 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">I am Arvind Pandey</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  I am a Lecturer and IT consultant
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I am a Lecturer at Crimson College of Technology, where I have the privilege of shaping the minds of future technologists and innovators. My passion for education extends beyond the classroom as I strive to inspire students to excel in their academic and professional journeys.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Education</h4>
                    <p className="text-sm text-muted-foreground">Master's in Computer Science</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Experience</h4>
                    <p className="text-sm text-muted-foreground">9+ years in IT industry</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Teaching</h4>
                    <p className="text-sm text-muted-foreground">Crimson College of Technology</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild>
                  <Link href="/about">
                    Learn More About Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-primary/10 to-purple-600/10 rounded-2xl flex items-center justify-center overflow-hidden">
                {/* Replace with your actual image */}
                <Image
                  src="/img3.jpeg"
                  alt="pp"
                  height={500}
                  width={500}
                  className="aspect-square bg-linear-to-br from-primary/10 to-purple-600/10 rounded-2xl flex items-center justify-center overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 bg-linear-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read my latest thoughts on web development, design, and technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(getPostDate(post)), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getReadingTime(post.excerpt)} min read
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <div className="flex justify-center gap-6">
            <Button variant="outline" size="icon" asChild>
              <a href="mailto:arvindtech93@gmail.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://wa.me/9779857088851"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-semibold text-sm">WA</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://www.linkedin.com/in/arvind-pandey-09bb83109/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
