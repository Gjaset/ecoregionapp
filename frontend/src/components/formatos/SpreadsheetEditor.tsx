import { useCallback, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import './formatos.css';

interface CeldaGrid {
  r: number;
  c: number;
  addr: string;
  value: string;
  isLabel: boolean;   // celda con contenido de la plantilla (texto fijo)
  rowspan: number;
  colspan: number;
  skip: boolean;      // absorbida por un merge
}

interface HojaRender {
  nombre: string;
  filas: CeldaGrid[][];
  ncols: number;
}

interface ImagenAncla {
  hoja: number;
  addr: string;   // celda 'from'
  colspan: number;
  rowspan: number;
  src: string;    // blob URL
}

interface Props {
  src: string;
  titulo: string;
  nombreArchivo: string;
  onError?: (msg: string) => void;
  onInfo?: (msg: string) => void;
}

const MAX_ROWS = 400;
const MAX_COLS = 120;

export function SpreadsheetEditor({ src, titulo, nombreArchivo, onError, onInfo }: Props) {
  const [loading, setLoading] = useState(true);
  const [hojas, setHojas] = useState<HojaRender[]>([]);
  const [hojaActiva, setHojaActiva] = useState(0);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [imagenes, setImagenes] = useState<ImagenAncla[]>([]);
  const originalBuffer = useRef<ArrayBuffer | null>(null);
  const sheetFiles = useRef<string[]>([]); // sheet1.xml, sheet2.xml...

  useEffect(() => {
    let activo = true;
    setLoading(true);
    (async () => {
      try {
        const resp = await fetch(src);
        if (!resp.ok) throw new Error('No se encontró la plantilla');
        const buf = await resp.arrayBuffer();
        if (!activo) return;
        originalBuffer.current = buf;

        // Leer estructura para renderizar (solo presentación)
        const wb = XLSX.read(buf, { type: 'array' });
        const orden = wb.SheetNames.slice();
        // mapear nombre -> sheetN.xml asumiendo orden estándar
        sheetFiles.current = orden.map((_, i) => `xl/worksheets/sheet${i + 1}.xml`);

        // Extraer imágenes/logos y sus celdas de anclaje (evitar compactarlas)
        const imgs = await extraerImagenes(buf, orden.length);
        const addrsConImagen = new Set(imgs.map((im) => im.addr));

        setHojas(orden.map((nombre) => parseHoja(wb.Sheets[nombre], nombre, addrsConImagen)));
        setValores({});
        setHojaActiva(0);
        if (activo) setImagenes(imgs);
      } catch (e) {
        if (activo) onError?.(`No se pudo cargar la plantilla: ${(e as Error).message}`);
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const setCelda = useCallback((addr: string, value: string) => {
    setValores((prev) => ({ ...prev, [addr]: value }));
  }, []);

  const exportar = useCallback(async () => {
    const buf = originalBuffer.current;
    if (!buf || !hojas[hojaActiva]) return;
    try {
      // Agrupar ediciones por hoja (sheet índices 0..n)
      const porHoja: Record<number, [string, string][]> = {};
      for (const [addr, value] of Object.entries(valores)) {
        if (value === '') continue;
        // Determinar a qué hoja pertenece (la primera que contenga la celda)
        const idx = hojas.findIndex((h) => h.filas.some((f) => f.some((c) => c.addr === addr)));
        if (idx >= 0) {
          (porHoja[idx] = porHoja[idx] || []).push([addr, value]);
        }
      }

      const zip = await JSZip.loadAsync(buf);
      for (const [idxStr, edits] of Object.entries(porHoja)) {
        const idx = Number(idxStr);
        const fileName = sheetFiles.current[idx];
        if (!fileName) continue;
        const file = zip.files[fileName];
        if (!file) continue;
        const xml = await file.async('string');
        const patched = patchSheetXml(xml, edits);
        zip.file(fileName, patched);
      }
      const out = await zip.generateAsync({ type: 'blob' });
      saveAs(out, `${nombreArchivo}_relleno.xlsx`);
      onInfo?.(`${titulo} exportado correctamente`);
    } catch (e) {
      onError?.(`No se pudo exportar: ${(e as Error).message}`);
    }
  }, [valores, hojas, hojaActiva, nombreArchivo, titulo, onInfo, onError]);

  const hoja = hojas[hojaActiva];

  if (loading) {
    return (
      <div className="spreadsheet-loading">
        <Loader2 className="spin" size={18} /> Cargando plantilla…
      </div>
    );
  }

  if (!hoja) {
    return <div className="spreadsheet-loading">No se pudo cargar la plantilla.</div>;
  }

  return (
    <div className="spreadsheet">
      <div className="spreadsheet-toolbar">
        <div className="spreadsheet-tabs" role="tablist">
          {hojas.map((h, i) => (
            <button
              key={h.nombre}
              className={i === hojaActiva ? 'is-active' : ''}
              onClick={() => setHojaActiva(i)}
              role="tab"
              aria-selected={i === hojaActiva}
              title={h.nombre}
            >
              {h.nombre.slice(0, 28)}
            </button>
          ))}
        </div>
        <div className="spreadsheet-actions">
          <a className="btn-secondary" href={src} download><Download size={16} /> Plantilla</a>
          <button className="btn-primary" onClick={() => void exportar()}><FileSpreadsheet size={16} /> Exportar Excel</button>
        </div>
      </div>

      <div className="spreadsheet-scroll">
        <table className="spreadsheet-table">
          <tbody>
            {hoja.filas.map((fila, ri) => (
              <tr key={ri}>
                {fila.map((celda, ci) => {
                  if (celda.skip) return null;
                  const valor = valores[celda.addr] ?? '';
                  const img = imagenes.find((im) => im.hoja === hojaActiva && im.addr === celda.addr);
                  const contenido = celda.isLabel ? (
                    <span className="spreadsheet-label">{celda.value}</span>
                  ) : (
                    <input
                      value={valor}
                      onChange={(e) => setCelda(celda.addr, e.target.value)}
                      aria-label={`Celda ${celda.addr}`}
                    />
                  );
                  return (
                    <td
                      key={ci}
                      rowSpan={celda.rowspan > 1 ? celda.rowspan : undefined}
                      colSpan={celda.colspan > 1 ? celda.colspan : undefined}
                      className={`${celda.isLabel ? 'is-label' : 'is-editable'}${img ? ' has-image' : ''}`}
                    >
                      {img && (
                        <img
                          className="spreadsheet-img"
                          src={img.src}
                          alt=""
                          style={{
                            width: `${Math.min(celda.colspan, 6) * 80}px`,
                            maxWidth: '100%',
                            display: 'block',
                            margin: '0 auto',
                          }}
                        />
                      )}
                      {contenido}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function parseHoja(ws: XLSX.WorkSheet, nombre: string, addrsConImagen: Set<string>): HojaRender {
  const ref = ws['!ref'];
  const range = ref ? XLSX.utils.decode_range(ref) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  const nrows = Math.min(range.e.r - range.s.r + 1, MAX_ROWS);
  const ncols = Math.min(range.e.c - range.s.c + 1, MAX_COLS);
  const merges = ws['!merges'] || [];

  const mergeInfo: Record<string, { rowspan: number; colspan: number }> = {};
  const skipSet = new Set<string>();
  for (const m of merges) {
    mergeInfo[XLSX.utils.encode_cell({ r: m.s.r, c: m.s.c })] = {
      rowspan: m.e.r - m.s.r + 1,
      colspan: m.e.c - m.s.c + 1,
    };
    for (let r = m.s.r; r <= m.e.r; r++) {
      for (let c = m.s.c; c <= m.e.c; c++) {
        if (r !== m.s.r || c !== m.s.c) skipSet.add(XLSX.utils.encode_cell({ r, c }));
      }
    }
  }

  const filas: CeldaGrid[][] = [];
  for (let r = range.s.r; r < range.s.r + nrows; r++) {
    const fila: CeldaGrid[] = [];
    for (let c = range.s.c; c < range.s.c + ncols; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      const raw = cell ? cell.v : undefined;
      const value = raw === undefined || raw === null ? '' : String(raw);
      const merge = mergeInfo[addr];
      fila.push({
        r, c, addr, value,
        isLabel: value !== '',
        rowspan: merge ? merge.rowspan : 1,
        colspan: merge ? merge.colspan : 1,
        skip: skipSet.has(addr),
      });
    }
    filas.push(fila);
  }

  // Compactar huecos horizontales: fusionar celdas vacías consecutivas en una sola
  compactarHuecos(filas, addrsConImagen);

  return { nombre, filas, ncols };
}

function compactarHuecos(filas: CeldaGrid[][], addrsConImagen: Set<string>) {
  for (let ri = 0; ri < filas.length; ri++) {
    const fila = filas[ri];
    for (let ci = 0; ci < fila.length; ci++) {
      const celda = fila[ci];
      if (celda.skip || celda.isLabel) continue;
      const addr = XLSX.utils.encode_cell({ r: celda.r, c: celda.c });
      if (addrsConImagen.has(addr)) continue;
      // Tiene merge ya aplicado -> no compactar
      if (celda.rowspan > 1 || celda.colspan > 1) continue;

      // Contar cuántas celdas vacías consecutivas a la derecha (misma fila)
      let contar = 1;
      for (let k = ci + 1; k < fila.length; k++) {
        const sig = fila[k];
        const sigAddr = XLSX.utils.encode_cell({ r: sig.r, c: sig.c });
        if (sig.skip) {
          // si está en un merge horizontal, no absorbemos (rompería la tabla)
          break;
        }
        if (sig.isLabel) break;
        if (addrsConImagen.has(sigAddr)) break;
        if (sig.rowspan > 1 || sig.colspan > 1) break;
        contar++;
      }

      if (contar > 1) {
        celda.colspan = contar;
        // marcar las absorbidas como skip y ajustar value de la primera
        for (let k = ci + 1; k < ci + contar; k++) {
          fila[k].skip = true;
        }
      }
      // saltar las absorbidas
      ci += contar - 1;
    }
  }
}

function patchSheetXml(xml: string, edits: [string, string][]): string {
  const insertions: string[] = [];
  for (const [addr, value] of edits) {
    // quitar cualquier <c r="ADDR" ... /> previo
    const cellRegex = new RegExp(`<c r="${addr}"[^>]*?(?:/>|>.*?</c>)`, 'g');
    xml = xml.replace(cellRegex, '');
    const escaped = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    insertions.push(`<c r="${addr}" t="inlineStr"><is><t xml:space="preserve">${escaped}</t></is></c>`);
  }
  if (insertions.length === 0) return xml;
  const payload = insertions.join('');
  if (xml.includes('</sheetData>')) {
    return xml.replace('</sheetData>', payload + '</sheetData>');
  }
  return xml + payload;
}

/**
 * Extrae las imágenes/logos de las hojas de un xlsx, devolviendo para cada
 * una su celda de anclaje (from), dimensiones en celdas y un blob URL.
 */
async function extraerImagenes(buf: ArrayBuffer, numHojas: number): Promise<ImagenAncla[]> {
  const resultado: ImagenAncla[] = [];
  try {
    const zip = await JSZip.loadAsync(buf);
    const colLetra = (c: number) => {
      let s = '';
      let n = c + 1;
      while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
      return s;
    };
    for (let i = 0; i < numHojas; i++) {
      const hojaIdx = i;
      const relPath = `xl/worksheets/_rels/sheet${i + 1}.xml.rels`;
      const relFile = zip.files[relPath];
      if (!relFile) continue;
      const relXml = await relFile.async('string');
      // encontrar drawing target
      const drawingTargets = [...relXml.matchAll(/Target="\.\.\/drawings\/([^"]+)"/g)].map((m) => m[1]);
      for (const drawingName of drawingTargets) {
        const drawingPath = `xl/drawings/${drawingName}`;
        const drawingFile = zip.files[drawingPath];
        if (!drawingFile) continue;
        const drawingXml = await drawingFile.async('string');
        const drawingRelsPath = `xl/drawings/_rels/${drawingName}.rels`;
        const drawingRelsFile = zip.files[drawingRelsPath];
        if (!drawingRelsFile) continue;
        const drawingRelsXml = await drawingRelsFile.async('string');
        const relMap: Record<string, string> = {};
        for (const m of drawingRelsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
          relMap[m[1]] = m[2];
        }

        // parsear anclas twoCellAnchor/oneCellAnchor
        const anchors = drawingXml.matchAll(/<xdr:(twoCellAnchor|oneCellAnchor)[\s\S]*?<\/xdr:\1>/g);
        for (const a of anchors) {
          const bloque = a[0];
          const from = bloque.match(/<xdr:from>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/);
          const to = bloque.match(/<xdr:to>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/);
          const blip = bloque.match(/r:embed="([^"]+)"/);
          if (!from || !blip) continue;
          const col = parseInt(from[1], 10);
          const row = parseInt(from[2], 10);
          const colFin = to ? parseInt(to[1], 10) : col;
          const rowFin = to ? parseInt(to[2], 10) : row;
          const target = relMap[blip[1]];
          if (!target) continue;
          const mediaPath = 'xl/' + target.replace(/^\.\.\//, '').replace('media/', 'media/');
          const mediaFile = zip.files[mediaPath];
          if (!mediaFile) continue;
          const data = await mediaFile.async('blob');
          const url = URL.createObjectURL(data);
          resultado.push({
            hoja: hojaIdx,
            addr: `${colLetra(col)}${row + 1}`,
            colspan: Math.max(1, colFin - col + 1),
            rowspan: Math.max(1, rowFin - row + 1),
            src: url,
          });
        }
      }
    }
  } catch {
    // si falla, simplemente no se muestran imágenes (no es fatal)
  }
  return resultado;
}