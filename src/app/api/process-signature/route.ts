import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const stepsParam = formData.get('steps') as string | null
    const formatParam = formData.get('format') as string | null
    
    const steps = stepsParam
      ? stepsParam.split(',').map(s => s.trim()).filter(Boolean)
      : ['dewapper', 'signature-extractor', 'unsharpen', 'color-correlation', 
        'remove-background', 'vectorize']

    if (!file || !file.name) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    console.log('[process-signature] Steps:', steps)
    console.log('[process-signature] Format requested:', formatParam)

    const fileExt = file.name.substring(file.name.lastIndexOf('.'))
    let currentBuffer = Buffer.from(await file.arrayBuffer())

    // Determinar formato de saída
    const outputFormat = formatParam || (steps.includes('vectorize') ? 'svg' : 'png')
    console.log('[process-signature] Output format:', outputFormat)

    for (const step of steps) {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/process-signature/${step}`
      console.log(`[process-signature] Processing step: ${step} with URL: ${apiUrl}`)
      
      const form = new FormData()
      const fileForStep = new File([currentBuffer], `input${fileExt}`)
      form.append('file', fileForStep)

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: form,
      })

      console.log(`[process-signature] Step ${step} response status: ${res.status}`)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`[process-signature] Step ${step} failed:`, errorText)
        return NextResponse.json({ error: `Step ${step} failed: ${errorText}` }, { status: 500 })
      }

      const blob = await res.blob()
      currentBuffer = Buffer.from(await blob.arrayBuffer())
      console.log(`[process-signature] Step ${step} completed. Buffer size: ${currentBuffer.length}`)
    }

    // Determinar Content-Type e extensão baseado no formato de saída
    let contentType: string
    let fileExtension: string
    
    switch (outputFormat.toLowerCase()) {
      case 'svg':
        contentType = 'image/svg+xml'
        fileExtension = '.svg'
        break
      case 'png':
        contentType = 'image/png'
        fileExtension = '.png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        fileExtension = '.jpg'
        break
      default:
        // Se não especificado, usar o formato original do arquivo
        contentType = fileExt === '.svg' ? 'image/svg+xml' : fileExt === '.png' ? 'image/png' : 'image/jpeg'
        fileExtension = fileExt
    }

    console.log(`[process-signature] Returning ${contentType} with extension ${fileExtension}`)

    return new NextResponse(currentBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="processed${fileExtension}"`,
      },
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[process-signature] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}