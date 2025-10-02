import { NextResponse } from 'next/server'
import { extractSignatureBuffer } from '@/lib/image_process/signature_extractor'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ status: 'error', message: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const processedBuffer = await extractSignatureBuffer(buffer)

    return new Response(processedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline; filename=signature-extracted.jpg'
      }
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[signature-extractor] Erro:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Signature extraction failed',
        details: error?.message || error.toString()
      },
      { status: 500 }
    )
  }
}