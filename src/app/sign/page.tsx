'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const DocumentViewer = dynamic(() => import('@/components/DocumentViewer'), { ssr: false })

export default function SignPage() {
  const router = useRouter()

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-center">Leia o documento antes de assinar</h1>
      <DocumentViewer />
      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            console.log('clique_em_assinar') // futura telemetria
            router.push('/handoff')
          }}
        >
          Assinar
        </button>
      </div>
    </main>
  )
}