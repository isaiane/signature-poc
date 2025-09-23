'use client'

import { QRCodeCanvas } from 'qrcode.react'

const token = 'xyz123' // stub, será gerado na fase de fingerprint
const mobileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/capture?token=${token}`

export default function HandoffPage() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-semibold">Continue no celular</h1>
      <p className="mt-4">Aponte a câmera para o QR Code e finalize a assinatura no seu celular.</p>

      <div className="mt-6 flex justify-center">
        <QRCodeCanvas value={mobileUrl} size={200} />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Ou acesse manualmente:<br />
        <a href={mobileUrl} className="text-blue-600 underline break-all">{mobileUrl}</a>
      </p>
    </main>
  )
}