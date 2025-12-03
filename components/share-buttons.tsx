'use client'

import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Linkedin } from 'lucide-react'

const WHATSAPP_NUMBER = '9779857088851'
const LINKEDIN_PROFILE = 'https://www.linkedin.com/in/arvind-pandey-09bb83109/'
const EMAIL = 'arvindtech93@gmail.com'

export function ShareButtons() {
  const pathname = usePathname()

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}${pathname ?? ''}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
    } catch (err) {
      console.error('Failed to copy url', err)
    }
  }, [currentUrl])

  const encodedUrl = encodeURIComponent(currentUrl)
  const encodedMessage = encodeURIComponent(`Check this out: ${currentUrl}`)

  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const whatsappShare = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
  const mailtoShare = `mailto:${EMAIL}?subject=${encodeURIComponent(
    'I wanted to share this with you'
  )}&body=${encodedMessage}`

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="gap-2 transition duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
      >
        <a href={linkedinShare} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="gap-2 transition duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
      >
        <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
          <Share2 className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="gap-2 transition duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
      >
        <a href={mailtoShare}>
          Email
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-2 transition duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
      >
        Copy Link
      </Button>
    </div>
  )
}


