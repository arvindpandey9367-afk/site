import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Linkedin, ArrowRight, Calendar, Clock, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { format } from 'date-fns'
import { PostSummary } from '@/types/post'
import { createPublicClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { LandingNav } from '@/components/landing-nav'

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
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 px-4 min-h-[90vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-block p-3 bg-primary/5 rounded-full mb-8 hover:scale-105 transition-transform duration-300">
              <Image 
                src="/img0.jpg" 
                alt="Arvind Pandey" 
                height={280} 
                width={280} 
                className="rounded-full object-cover shadow-xl" 
                priority
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Arvind Pandey
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-light">
              IT Lecturer & Tech Consultant
            </p>
            <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Passionate educator at Crimson College of Technology, empowering the next generation of tech innovators
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <a href="#blog">Explore Articles</a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8" asChild>
                <a href="#contact">Get In Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">About Me</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Arvind Pandey</h3>
                <p className="text-xl text-primary font-medium">
                  IT Lecturer & Technology Consultant
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Lecturer at Crimson College of Technology, where I have the privilege of shaping the minds of future technologists and innovators. My passion for education extends beyond the classroom as I strive to inspire students to excel in their academic and professional journeys.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-muted/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Education</h4>
                    <p className="text-muted-foreground">Master&apos;s in Computer Science</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-muted/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Experience</h4>
                    <p className="text-muted-foreground">9+ years in IT industry</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-muted/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Teaching</h4>
                    <p className="text-muted-foreground">Crimson College of Technology</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-first md:order-last">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-4 border-muted/20">
                <Image
                  src="/img3.jpeg"
                  alt="Arvind Pandey"
                  height={600}
                  width={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 bg-linear-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Articles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights on web development, technology trends, and teaching methodologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-muted/50"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <time>{format(new Date(getPostDate(post)), 'MMM d, yyyy')}</time>
                    <span>•</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getReadingTime(post.excerpt)} min read</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn hover:gap-3 transition-all" 
                    asChild
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read Article 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="px-8" asChild>
              <Link href="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Have a project in mind or want to discuss technology? Feel free to reach out through any of these channels.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-14 rounded-full hover:scale-110 transition-transform duration-200" 
              asChild
            >
              <a href="mailto:arvindtech93@gmail.com" aria-label="Email">
                <Mail className="h-6 w-6" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-14 rounded-full hover:scale-110 transition-transform duration-200" 
              asChild
            >
              <a
                href="https://wa.me/9779857088851"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <span className="font-bold text-base">WA</span>
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-14 rounded-full hover:scale-110 transition-transform duration-200" 
              asChild
            >
              <a
                href="https://www.linkedin.com/in/arvind-pandey-09bb83109/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted/30 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/img0.jpg" 
                alt="Arvind Pandey" 
                width={32} 
                height={32} 
                className="rounded-full object-cover"
              />
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Arvind Pandey. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="mailto:arvindtech93@gmail.com" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                arvindtech93@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
