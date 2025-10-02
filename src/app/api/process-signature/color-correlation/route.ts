import { NextRequest, NextResponse } from 'next/server'
import { applyColorCorrelation } from '@/lib/image_process/color_correlation'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file = data.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const outputBuffer = await applyColorCorrelation(buffer)

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline; filename="color-corrected.jpg"',
      },
    })
  } catch (error) {
    console.error('[color-correlation] Erro:', error)
    return NextResponse.json({ error: 'Erro ao aplicar correção de cor' }, { status: 500 })
  }
}
