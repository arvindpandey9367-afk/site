'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from 'react'

interface MarkdownRendererProps {
	content: string
	className?: string
}

// Light theme for syntax highlighting
const lightTheme = {
	'code[class*="language-"]': {
		color: '#24292e',
		background: 'none',
		fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
		textAlign: 'left',
		whiteSpace: 'pre',
		wordSpacing: 'normal',
		wordBreak: 'normal',
		wordWrap: 'normal',
		lineHeight: '1.5',
		MozTabSize: '4',
		OTabSize: '4',
		tabSize: '4',
		WebkitHyphens: 'none',
		MozHyphens: 'none',
		msHyphens: 'none',
		hyphens: 'none'
	},
	'pre[class*="language-"]': {
		color: '#24292e',
		background: '#f6f8fa',
		fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
		textAlign: 'left',
		whiteSpace: 'pre',
		wordSpacing: 'normal',
		wordBreak: 'normal',
		wordWrap: 'normal',
		lineHeight: '1.5',
		MozTabSize: '4',
		OTabSize: '4',
		tabSize: '4',
		WebkitHyphens: 'none',
		MozHyphens: 'none',
		msHyphens: 'none',
		hyphens: 'none',
		padding: '1em',
		margin: '.5em 0',
		overflow: 'auto',
		borderRadius: '0.375rem',
		border: '1px solid #e1e4e8'
	}
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return (
			<div
				className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
				dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
			/>
		)
	}

	return (
		<div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// Headings with anchors
					h1: ({ node, ...props }) => (
						<h1 className="text-4xl font-bold mt-8 mb-4 scroll-mt-20" {...props} />
					),
					h2: ({ node, ...props }) => (
						<h2 className="text-3xl font-bold mt-8 mb-4 scroll-mt-20" {...props} />
					),
					h3: ({ node, ...props }) => (
						<h3 className="text-2xl font-bold mt-6 mb-3 scroll-mt-20" {...props} />
					),
					h4: ({ node, ...props }) => (
						<h4 className="text-xl font-bold mt-4 mb-2 scroll-mt-20" {...props} />
					),

					// Paragraphs
					p: ({ node, ...props }) => (
						<p className="my-4 leading-relaxed" {...props} />
					),

					// Lists
					ul: ({ node, ...props }) => (
						<ul className="my-4 pl-6 list-disc" {...props} />
					),
					ol: ({ node, ...props }) => (
						<ol className="my-4 pl-6 list-decimal" {...props} />
					),
					li: ({ node, ...props }) => (
						<li className="my-1" {...props} />
					),

					// Blockquotes
					blockquote: ({ node, ...props }) => (
						<blockquote
							className="border-l-4 border-primary pl-4 italic my-4 py-2 bg-muted/30"
							{...props}
						/>
					),

					// Code blocks
					code({ node, inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '')

						if (inline) {
							return (
								<code
									className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono"
									{...props}
								>
									{children}
								</code>
							)
						}

						return match ? (
							<div className="relative my-6">
								<div className="absolute top-0 right-0 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-bl rounded-tr">
									{match[1]}
								</div>
								<SyntaxHighlighter
									style={vscDarkPlus}
									language={match[1]}
									PreTag="div"
									className="!mt-0 !mb-0 rounded-lg"
									showLineNumbers
									lineNumberStyle={{
										minWidth: '3em',
										paddingRight: '1em',
										textAlign: 'right',
										userSelect: 'none',
										opacity: 0.5
									}}
									{...props}
								>
									{String(children).replace(/\n$/, '')}
								</SyntaxHighlighter>
							</div>
						) : (
							<pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
								<code className="text-sm" {...props}>
									{children}
								</code>
							</pre>
						)
					},

					// Links
					a: ({ node, ...props }) => (
						<a
							className="text-primary hover:underline font-medium"
							target="_blank"
							rel="noopener noreferrer"
							{...props}
						/>
					),

					// Tables
					table: ({ node, ...props }) => (
						<div className="overflow-x-auto my-6">
							<table className="min-w-full divide-y divide-border" {...props} />
						</div>
					),
					thead: ({ node, ...props }) => (
						<thead className="bg-muted" {...props} />
					),
					th: ({ node, ...props }) => (
						<th className="px-4 py-3 text-left text-sm font-semibold" {...props} />
					),
					td: ({ node, ...props }) => (
						<td className="px-4 py-3 text-sm border-t border-border" {...props} />
					),

					// Horizontal rule
					hr: ({ node, ...props }) => (
						<hr className="my-8 border-border" {...props} />
					),

					// Images
					img: ({ node, ...props }) => (
						<img
							className="rounded-lg my-6 max-w-full h-auto"
							loading="lazy"
							{...props}
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
