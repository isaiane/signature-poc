import Jimp from "jimp"

interface DewapperOptions {
  maxWidth?: number;
}

export async function dewapper(
  inputBuffer: Buffer,
  options: DewapperOptions = {}
): Promise<Buffer> {
  const maxWidth = options.maxWidth || 1000
  const image = await Jimp.read(inputBuffer)

  // Resize se necessário
  if (image.getWidth() > maxWidth) {
    image.resize(maxWidth, Jimp.AUTO)
  }

  // Converter para escala de cinza
  image.grayscale()
  
  // Aplicar normalização
  image.normalize()
  
  // Reduzir brilho
  image.brightness(0.01)
  
  // Aumentar contraste
  image.contrast(0.02)

  // Retornar buffer processado
  const outputBuffer = await image.getBufferAsync(Jimp.MIME_PNG)
  return outputBuffer
}