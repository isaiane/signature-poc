

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const {
      pdfBase64,
      signatureBase64,
      page,
      x,
      y,
      width,
      height,
    } = await req.json()

    if (!pdfBase64 || !signatureBase64 || page === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pdfBytes = Buffer.from(pdfBase64, 'base64')
    const signatureBytes = Buffer.from(
      signatureBase64.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const targetPage = pages[page]

    if (!targetPage) {
      return NextResponse.json({ error: 'Invalid page index' }, { status: 400 })
    }

    const signatureImage = await pdfDoc.embedPng(signatureBytes)
    targetPage.drawImage(signatureImage, {
      x,
      y,
      width,
      height,
    })

    const signedPdfBytes = await pdfDoc.save()
    const signedPdfBase64 = Buffer.from(signedPdfBytes).toString('base64')

    return NextResponse.json({ signedPdfBase64 })
  } catch (err) {
    console.error('[apply-signature]', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}