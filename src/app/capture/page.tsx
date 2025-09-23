'use client'

import { useSearchParams } from 'next/navigation'
import { getOrCreateDeviceId } from '@/lib/device'
import { useEffect, useState } from 'react'

export default function CapturePage() {
  const search = useSearchParams()
  const tokenFromUrl = search.get('token')
  const [deviceId, setDeviceId] = useState<string | null>(null)

  useEffect(() => {
    const localId = getOrCreateDeviceId()
    setDeviceId(localId)
    console.log('[capture] deviceId:', localId)
    // Futuro: POST /api/signature-session com { tokenFromUrl, deviceId }
  }, [tokenFromUrl])

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-semibold mb-2">Captura de Assinatura</h1>
      <p className="text-green-600">Dispositivo pronto para assinar</p>
      <p className="text-sm text-gray-500 mt-4 break-all">
        <strong>deviceId:</strong><br />
        {deviceId}
      </p>
    </main>
  )
}