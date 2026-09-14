import { useCallback, useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, FileText, Loader2 } from 'lucide-react';
import './formatos.css';

interface Props {
  src: string;
  titulo: string;
  nombreArchivo: string;
  /** Mapa campo -> etiqueta exacta presente en el documento para ubicar la celda a rellenar */
  mapeo: Record<string, string>;
  /** Valores actuales de los campos */
  valores: Record<string, unknown>;
  onError?: (msg: string) => void;
  onInfo?: (msg: string) => void;
}

export function DocxEditor({ src, titulo, nombreArchivo, mapeo, valores, onError, onInfo }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const originalBuffer = useRef<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    (async () => {
      try {
        const resp = await fetch(encodeURI(src));
        if (!resp.ok) throw new Error('No se encontró la plantilla');
        const buf = await resp.arrayBuffer();
        if (!activo) return;
        originalBuffer.current = buf;
        if (contenedor.current) {
          const docx = await import('docx-preview');
          await docx.renderAsync(buf, contenedor.current, undefined, {
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            breakPages: true,
          });
        }
      } catch (e) {
        if (activo) onError?.(`No se pudo cargar la plantilla: ${(e as Error).message}`);
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const exportar = useCallback(async () => {
    const buf = originalBuffer.current;
    if (!buf) return;
    try {
      const zip = await JSZip.loadAsync(buf);
      const file = zip.files['word/document.xml'];
      if (!file) throw new Error('document.xml no encontrado');
      let xml = await file.async('string');

      for (const [campo, etiqueta] of Object.entries(mapeo)) {
        const valorRaw = valores[campo];
        if (valorRaw === undefined || valorRaw === null) continue;
        const valor = String(valorRaw).trim();
        if (!valor) continue;
        xml = reemplazarEnCelda(xml, etiqueta, valor);
      }

      zip.file('word/document.xml', xml);
      const out = await zip.generateAsync({ type: 'blob' });
      saveAs(out, `${nombreArchivo}_relleno.docx`);
      onInfo?.(`${titulo} exportado correctamente`);
    } catch (e) {
      onError?.(`No se pudo exportar: ${(e as Error).message}`);
    }
  }, [mapeo, valores, nombreArchivo, titulo, onInfo, onError]);

  if (loading) {
    return (
      <div className="spreadsheet-loading">
        <Loader2 className="spin" size={18} /> Cargando plantilla…
      </div>
    );
  }

  return (
    <div className="docx-editor">
      <div className="spreadsheet-toolbar">
        <div className="docx-titulo">{titulo}</div>
        <div className="spreadsheet-actions">
          <a className="btn-secondary" href={encodeURI(src)} download><Download size={16} /> Plantilla</a>
          <button className="btn-primary" onClick={() => void exportar()}><FileText size={16} /> Exportar Word</button>
        </div>
      </div>
      <div className="docx-scroll">
        <div className="docx-canvas" ref={contenedor} />
      </div>
    </div>
  );
}

/**
 * Reemplaza el texto de la celda vacía que sigue a la celda que contiene
 * `etiqueta`, dentro de la misma fila. Devuelve el XML modificado.
 */
function reemplazarEnCelda(xml: string, etiqueta: string, valor: string): string {
  // Encontrar la celda (<w:tc>...</w:tc>) que contiene la etiqueta.
  const tcRegex = /<w:tc\b[^>]*>[\s\S]*?<\/w:tc>/g;
  const celdas = [...xml.matchAll(tcRegex)];
  const idx = celdas.findIndex((m) => m[0].includes(etiqueta));
  if (idx === -1 || !celdas[idx + 1]) return xml;

  const celdaDestino = celdas[idx + 1][0];
  const textoEsc = valor
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Si la celda destino tiene un <w:t> (aunque vacío), reescribirlo; si no, inyectar uno.
  let nuevaCelda: string;
  if (/<w:t[^>]*>[\s\S]*?<\/w:t>/.test(celdaDestino)) {
    nuevaCelda = celdaDestino.replace(/<w:t[^>]*>[\s\S]*?<\/w:t>/, `<w:t xml:space="preserve">${textoEsc}</w:t>`);
  } else {
    nuevaCelda = celdaDestino.replace(/<w:tcPr>[\s\S]*?<\/w:tcPr>/, (m) => m) .replace(/<\/w:tc>/, `<w:p><w:r><w:t xml:space="preserve">${textoEsc}</w:t></w:r></w:p></w:tc>`);
  }

  // Reemplazar la celda destino por la modificada.
  return xml.replace(celdaDestino, nuevaCelda);
}