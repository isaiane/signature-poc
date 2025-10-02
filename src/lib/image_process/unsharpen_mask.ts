import sharp from 'sharp'

/**
 * Aplica a máscara de nitidez à imagem de entrada.
 * Aumenta o contraste local sem aumentar ruído.
 */
export async function applyUnsharpenMask(input: Buffer): Promise<Buffer> {
  const result = await sharp(input)
    .sharpen({
      sigma: 1.2,
      m1: 0.4,
      m2: 0.4,
      x1: 3,
      y2: 10,
      y3: 20,
    })
    .toBuffer()

  return result
}