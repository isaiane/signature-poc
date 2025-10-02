export async function processSignature(dataUrl: string, steps: string[] = []) {
  const blob = await (await fetch(dataUrl)).blob()
  const formData = new FormData()
  formData.append('file', blob, 'signature.jpg')
  formData.append('steps', steps.join(','))

  const response = await fetch('/api/process-signature', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('[processSignature] server error:', error)
    throw new Error('Erro ao processar imagem')
  }

  const { png } = await response.json()
  return { png }
}