import { useEffect, useState } from 'react'

/**
 * Hook que garante que o código só execute no cliente
 * Útil para evitar problemas de hidratação com APIs do navegador
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
