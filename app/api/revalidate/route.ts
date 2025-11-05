import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret')
    const expectedSecret = process.env.REVALIDATE_SECRET
    
    // In development, allow revalidation without secret or with empty secret
    // In production, require the secret
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment && expectedSecret && secret !== expectedSecret) {
      console.error('❌ Revalidation rejected: Invalid secret')
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    if (!isDevelopment && !expectedSecret) {
      console.warn('⚠️ REVALIDATE_SECRET not set in production')
    }

    const body = await request.json()
    const { path, type } = body

    console.log('🔄 Revalidation request:', { path, type })

    if (type === 'path' && path) {
      // Revalidate the specific path
      revalidatePath(path)
      
      // Also revalidate the catch-all route pattern for dynamic routes
      // This ensures the [...slug] route is also revalidated
      if (path !== '/') {
        revalidatePath(path, 'page')
      }
      
      console.log('✅ Revalidated path:', path)
      return NextResponse.json({ revalidated: true, path, now: Date.now() })
    }

    return NextResponse.json(
      { message: 'Missing path or invalid type' },
      { status: 400 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

