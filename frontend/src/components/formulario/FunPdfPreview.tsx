import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props {
  previewUrl: string;
}

export function FunPdfPreview({ previewUrl }: Props) {
  return (
    <div className="fun-preview">
      <div className="fun-preview-header">
        <h3>Vista previa del documento</h3>
        <a className="btn-secondary" href={previewUrl} download="formato_unico_nacional.pdf">
          Descargar de nuevo
        </a>
      </div>
      <div className="fun-preview-body">
        <Document
          file={previewUrl}
          onLoadError={(err) => console.error('Error cargando vista previa', err)}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={520}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}

export default FunPdfPreview;