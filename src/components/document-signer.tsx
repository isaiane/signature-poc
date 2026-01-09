"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"

// Importação dinâmica do react-pdf para evitar problemas de SSR
const Document = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Document })), { 
  ssr: false,
  loading: () => <div>Carregando PDF...</div>
})
const Page = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Page })), { 
  ssr: false,
  loading: () => <div>Carregando página...</div>
})

// Configurar PDF.js worker dinamicamente
if (typeof window !== 'undefined') {
  import('react-pdf').then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  })
}

export default function DocumentSigner() {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [width, setWidth] = useState<number>(800)
  const [error, setError] = useState<string | null>(null)
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)
  const [signedPage, setSignedPage] = useState<number | null>(null)
  const [signaturePosition] = useState({ x: 100, y: 100 })
  const [signatureSize] = useState({ width: 150, height: 50 })

  // const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWidth = () =>
        setWidth(Math.max(300, window.innerWidth > 800 ? 800 : window.innerWidth - 40))
      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img = sessionStorage.getItem("signature-final")
      if (img) setSignatureUrl(img)
    }
  }, [])

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages))

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="relative w-fit">
        <Document
          file="/sample.pdf"
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
            setError(null)
            setPageNumber(1)
          }}
          onLoadError={e => { setError("Erro ao carregar PDF"); console.error(e); }}
          onSourceError={e => { setError("Erro na fonte do PDF"); console.error(e); }}
          loading={<span>Carregando PDF...</span>}
          error={<span>{error || "Não foi possível exibir o PDF."}</span>}
          noData={<span>Nenhum PDF selecionado.</span>}
        >
          <Page pageNumber={pageNumber} width={width} />
        </Document>

        {signatureUrl && pageNumber === signedPage && (
          <div
            style={{
              position: 'absolute',
              left: signaturePosition.x,
              top: signaturePosition.y,
              width: signatureSize.width,
              height: signatureSize.height,
              border: '2px dashed #007bff',
              cursor: 'move'
            }}
          >
            <Image src={signatureUrl} alt="assinatura" width={150} height={50} className="pointer-events-none" />
          </div>
        )}
      </div>

      {signatureUrl && signedPage === null && (
        <button
          onClick={() => setSignedPage(pageNumber)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Posicionar assinatura nesta página
        </button>
      )}

      {numPages > 0 && (
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {pageNumber} de {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}