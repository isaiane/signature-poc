import { NextRequest, NextResponse } from 'next/server'
import { applyUnsharpenMask } from '@/lib/image_process/unsharpen_mask'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ status: 'error', message: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const outputBuffer = await applyUnsharpenMask(buffer)

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="unsharpened.jpg"`,
      },
    })
  } catch (error) {
    console.error('[unsharpen-mask] Erro:', error)
    return NextResponse.json({ status: 'error', message: 'Processing failed' }, { status: 500 })
  }
}