import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Log request details for debugging
    console.log('🔄 Revalidation request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    })

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
      return NextResponse.json(
        { revalidated: true, path, now: Date.now() },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    return NextResponse.json(
      { message: 'Missing path or invalid type' },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('❌ Error in revalidate route:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

