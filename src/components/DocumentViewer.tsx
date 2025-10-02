"use client"

import { Document, Page } from "react-pdf";
import { useEffect, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "@/lib/pdf_worker";

export default function DocumentViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState<number>(800);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateWidth = () =>
      setWidth(Math.max(300, window.innerWidth > 800 ? 800 : window.innerWidth - 40));
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <Document
        file={process.env.NEXT_PUBLIC_DOC_URL || "/sample.pdf"}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setError(null);
          setPageNumber(1); // Sempre volta para a primeira página ao carregar novo PDF
        }}
        onLoadError={e => { setError("Erro ao carregar PDF"); console.error(e); }}
        onSourceError={e => { setError("Erro na fonte do PDF"); console.error(e); }}
        loading={<span>Carregando PDF...</span>}
        error={<span>{error || "Não foi possível exibir o PDF."}</span>}
        noData={<span>Nenhum PDF selecionado.</span>}
      >
        <Page pageNumber={pageNumber} width={width} />
      </Document>
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
  );
}