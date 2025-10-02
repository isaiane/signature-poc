import Jimp from 'jimp'

function binarizeImage(image: Jimp, threshold: number): void {
  console.log(`[binarizeImage] Applying threshold: ${threshold}`)
  const start = performance.now()

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const brightness = this.bitmap.data[idx]
    const isInk = brightness < threshold
    const value = isInk ? 0 : 255

    this.bitmap.data[idx + 0] = value
    this.bitmap.data[idx + 1] = value
    this.bitmap.data[idx + 2] = value
  })

  console.log(`[binarizeImage] Completed in ${(performance.now() - start).toFixed(2)}ms`)
}

function removeHorizontalLines(image: Jimp): void {
  const { width, height } = image.bitmap
  const lineThickness = 2
  const blackThreshold = 0.6

  console.log(`[removeHorizontalLines] width=${width}, height=${height}`)

  const start = performance.now()
  let linesRemoved = 0

  for (let y = 0; y < height - lineThickness; y++) {
    let blackCount = 0
    for (let x = 0; x < width; x++) {
      for (let dy = 0; dy < lineThickness; dy++) {
        const idx = image.getPixelIndex(x, y + dy)
        const value = image.bitmap.data[idx]
        if (value < 50) blackCount++
      }
    }

    const totalPixels = width * lineThickness
    if (blackCount / totalPixels >= blackThreshold) {
      linesRemoved++
      for (let x = 0; x < width; x++) {
        for (let dy = 0; dy < lineThickness; dy++) {
          const idx = image.getPixelIndex(x, y + dy)
          image.bitmap.data[idx + 0] = 255
          image.bitmap.data[idx + 1] = 255
          image.bitmap.data[idx + 2] = 255
        }
      }
    }
  }

  console.log(`[removeHorizontalLines] Removed ${linesRemoved} lines in ${(performance.now() - start).toFixed(2)}ms`)
}

/**
 * Step 2 - Signature Extractor (Buffer version)
 * Receives a grayscale image as a Buffer and applies thresholding + background removal
 * to highlight the signature. Returns a JPEG Buffer. Threshold and contrast are configurable via the options parameter.
 *
 * @param input - The input image as a Buffer
 * @param options - Optional processing options: { threshold, contrast }
 * @returns A Promise that resolves to a Buffer containing the processed JPEG image
 */
export async function extractSignatureBuffer(
  input: Buffer,
  options?: { threshold?: number; contrast?: number }
): Promise<Buffer> {
  try {
    console.log('[extractSignatureBuffer] Starting image processing...')
    const image = await Jimp.read(input)
    console.log(`[extractSignatureBuffer] Loaded image: ${image.bitmap.width}x${image.bitmap.height}`)

    image.grayscale()
    console.log('[extractSignatureBuffer] Grayscale applied.')

    const contrast = options?.contrast ?? 0.2
    image.contrast(contrast)
    console.log(`[extractSignatureBuffer] Contrast applied: ${contrast}`)

    const threshold = options?.threshold ?? 150
    binarizeImage(image, threshold)

    // Comentar remoção de linhas horizontais para não apagar a assinatura
    // removeHorizontalLines(image)

    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
    console.log('[extractSignatureBuffer] Processing complete. Buffer size:', buffer.length)

    return buffer
  } catch (err) {
    console.error('[signature-extractor] Failed to process image:', err)
    throw err
  }
}