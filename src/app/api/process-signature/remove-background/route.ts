import { NextRequest, NextResponse } from 'next/server'
import { removeBackground } from '@/lib/image_process/remove-background'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const resultBuffer = await removeBackground(buffer)

  return new NextResponse(resultBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename=transparent.png',
    },
  })
}
