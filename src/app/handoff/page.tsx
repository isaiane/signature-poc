'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientOnly } from '@/hooks/useClientOnly'

export default function HandoffPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const isClient = useClientOnly()

  useEffect(() => {
    if (!isClient) return
    
    const userAgent = navigator.userAgent
    const mobileRegex = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    const isMobileDevice = mobileRegex.test(userAgent)
    setIsMobile(isMobileDevice)

    if (isMobileDevice) {
      router.replace('/mobile/start')
    }
  }, [router, isClient])

  if (!isClient) return null
  if (isMobile === null) return null
  if (isMobile) return null

  const token = 'stub-token-123'
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/mobile/start?token=${token}`

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-semibold">Continue no celular</h1>
      <p className="mt-4">Escaneie o QR Code para continuar</p>
      <div className="mt-6 flex justify-center">
        <QRCodeCanvas value={url} size={200} />
      </div>
      <p className="mt-4 text-sm text-gray-500 break-all">
        Ou acesse: <a href={url} className="underline text-blue-600">{url}</a>
      </p>
    </main>
  )
}