import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {

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

