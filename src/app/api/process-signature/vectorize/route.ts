import { NextRequest, NextResponse } from 'next/server'
import { vectorizeImage } from '@/lib/image_process/vectorizer'

// Force Node.js runtime for potrace compatibility
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    
    // Opções de vetorização
    const options = {
      threshold: 200,
      color: '#000000',
      background: 'transparent',
      turnPolicy: 'minority',
      turdSize: 1,
      optCurve: true,
      optTolerance: 0.3,
    }

    // Vetorizar a imagem
    const svgBuffer = await vectorizeImage(inputBuffer, options)

    return new NextResponse(new Uint8Array(svgBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'inline; filename="vectorized.svg"',
      },
    })

  } catch (error) {
    console.error('[vectorize] Error:', error)
    return NextResponse.json({ error: 'Vectorization failed' }, { status: 500 })
  }
}
