import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import '../../styles.css'

type BlogParams = {
  slug: string
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const result = await payload.find({
    collection: 'blog',
    limit: 1000, // Adjust if you have more than 1000 blog posts
    depth: 0,
  })
  
  return result.docs.map((blog) => ({
    slug: blog.slug as string,
  }))
}

// Static generation with fallback - pages are generated at build time
// New blog posts created after build will be generated on-demand
export const dynamicParams = true

export default async function BlogPage({ params }: { params: Promise<BlogParams> }) {
  const { slug } = await params
  
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const result = await payload.find({
    collection: 'blog',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })
  
  const blog = result.docs[0] as unknown as {
    id: string
    title: string
    slug: string
    author?: {
      id: string
      name?: string
      bio?: string
      avatar?: {
        id: string
        url?: string
        alt?: string
      } | string | null
    } | string | null
    publishedDate?: string
    headerImage?: {
      id: string
      url?: string
      alt?: string
      width?: number
      height?: number
    } | string | null
    content: Record<string, unknown>
  }
  
  if (!blog) {
    notFound()
  }
  
  const headerImage = typeof blog.headerImage === 'object' && blog.headerImage !== null 
    ? blog.headerImage 
    : null
  const imageUrl = headerImage && typeof headerImage === 'object' && 'url' in headerImage
    ? headerImage.url || '/file.svg'
    : '/file.svg'
  
  const author = typeof blog.author === 'object' && blog.author !== null 
    ? blog.author 
    : null
  const authorName = author && typeof author === 'object' && 'name' in author
    ? author.name
    : null
  const authorAvatar = author && typeof author === 'object' && 'avatar' in author
    ? typeof author.avatar === 'object' && author.avatar !== null
      ? author.avatar
      : null
    : null
  const avatarUrl = authorAvatar && typeof authorAvatar === 'object' && 'url' in authorAvatar
    ? authorAvatar.url || '/file.svg'
    : '/file.svg'
  
  return (
    <article className="w-full bg-white">
      {/* Header Image */}
      {headerImage && (
        <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={typeof headerImage === 'object' && 'alt' in headerImage ? headerImage.alt || blog.title : blog.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-black tracking-tight">
          {blog.title}
        </h1>
        
        {/* Author and Date */}
        {(authorName || blog.publishedDate) && (
          <div className="flex items-center gap-4 mb-8">
            {authorAvatar && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-200 shrink-0 bg-gray-100">
                <Image
                  src={avatarUrl}
                  alt={authorName || 'Author'}
                  fill
                  className="object-cover"
                  sizes="48px"
                  quality={100}
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className="flex items-center gap-4 text-gray-600 flex-wrap">
              {authorName && (
                <span className="font-medium text-gray-700">By {authorName}</span>
              )}
              {blog.publishedDate && (
                <>
                  {authorName && <span className="text-gray-400">•</span>}
                  <time dateTime={blog.publishedDate} className="text-gray-600">
                    {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="prose prose-lg max-w-none blog-content">
          {blog.content && <RichText data={blog.content as unknown as Parameters<typeof RichText>[0]['data']} />}
        </div>
      </div>
    </article>
  )
}

