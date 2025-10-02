import { NextRequest, NextResponse } from 'next/server'
import { vectorizeImage, vectorizeAndSave } from '@/lib/image_process/vectorizer'

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

    // Salvar na pasta temp para checagem
    const timestamp = Date.now()
    const filepath = await vectorizeAndSave(inputBuffer, `vectorized_${timestamp}`, options)
    console.log(`[vectorize] SVG salvo para checagem em: ${filepath}`)

    return new NextResponse(svgBuffer, {
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
