import * as potrace from 'potrace'

interface VectorizeOptions {
  threshold?: number
  color?: string
  background?: string
  turnPolicy?: string
  turdSize?: number
  optCurve?: boolean
  optTolerance?: number
}

/**
 * Converte uma imagem PNG para SVG vetorial usando potrace
 * @param inputBuffer - Buffer da imagem PNG
 * @param options - Opções de vetorização
 * @returns Promise<Buffer> - Buffer contendo o SVG
 */
export async function vectorizeImage(
  inputBuffer: Buffer,
  options: VectorizeOptions = {}
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const config = {
      threshold: options.threshold ?? 128,
      color: options.color ?? '#000000',
      background: options.background ?? 'transparent',
      turnPolicy: options.turnPolicy ?? 'minority',
      turdSize: options.turdSize ?? 2,
      optCurve: options.optCurve ?? true,
      optTolerance: options.optTolerance ?? 0.4,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    potrace.trace(inputBuffer, config, (err: any, svg: string) => {
      if (err) {
        console.error('[vectorizer] Erro na vetorização:', err)
        reject(err)
        return
      }

      const svgBuffer = Buffer.from(svg, 'utf8')
      console.log('[vectorizer] Imagem vetorizada com sucesso')
      resolve(svgBuffer)
    })
  })
}


/**
 * Vetoriza uma assinatura com configurações otimizadas
 * @param inputBuffer - Buffer da imagem PNG da assinatura
 * @returns Promise<Buffer> - Buffer contendo o SVG da assinatura
 */
export async function vectorizeSignature(inputBuffer: Buffer): Promise<Buffer> {
  const options: VectorizeOptions = {
    threshold: 200,        // Threshold alto para capturar apenas linhas escuras
    color: '#000000',      // Preto para a assinatura
    background: 'transparent', // Fundo transparente
    turnPolicy: 'minority',    // Política de curva
    turdSize: 1,           // Remove pequenos fragmentos
    optCurve: true,        // Otimiza curvas
    optTolerance: 0.05,     // Tolerância de otimização
  }

  return vectorizeImage(inputBuffer, options)
}