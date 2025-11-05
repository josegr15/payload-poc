import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret')
    
    // Verify the secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { path, type } = body

    if (type === 'path' && path) {
      revalidatePath(path)
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

