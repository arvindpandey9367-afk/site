import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Github, Linkedin, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React & Node.js",
      tech: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "Task Management App",
      description: "Productivity app with real-time collaboration",
      tech: ["Next.js", "Socket.io", "PostgreSQL"]
    },
    {
      title: "AI Chat Assistant",
      description: "Intelligent chatbot using OpenAI API",
      tech: ["Python", "FastAPI", "React"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Arvind Pandey</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Full Stack Developer & UI/UX Designer
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

      {/* Projects Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read my latest thoughts on web development, design, and technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* This would be dynamic from your API */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  <Link href="/blog/getting-started-with-nextjs">
                    Getting Started with Next.js 14
                  </Link>
                </CardTitle>
                <CardDescription>
                  Learn about the new features and improvements in Next.js 14
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Jan 15, 2024</span>
                  <span>5 min read</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  <Link href="/blog/typescript-best-practices">
                    TypeScript Best Practices
                  </Link>
                </CardTitle>
                <CardDescription>
                  Improve your TypeScript code with these patterns and practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Jan 10, 2024</span>
                  <span>8 min read</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  <Link href="/blog/tailwind-css-tips">
                    Tailwind CSS Tips & Tricks
                  </Link>
                </CardTitle>
                <CardDescription>
                  Advanced techniques for working with Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Jan 5, 2024</span>
                  <span>6 min read</span>
                </div>
              </CardContent>
            </Card>
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
              <a href="mailto:hello@example.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
