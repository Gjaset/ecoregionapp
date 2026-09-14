// Mapeo explícito celda→campo por plantilla.
//
// Las coordenadas A1 se obtuvieron inspeccionando la estructura real de cada
// plantilla oficial (merges + etiquetas). La exportación escribe el valor en
// la celda indicada, de forma determinista (sin el frágil findCellAddress).

// PM04-PR30-F1 (SDA) — hoja "Solicitud evaluación"
export const F1_MAP: Record<string, string> = {
  tipoAprovechamiento: 'B6',       // "Árboles aislados / Único / Doméstico / Persistente"
  nombreRazonSocial: 'I17',        // "2. Nombre o Razón Social:"
  numeroIdentificacion: 'J19',     // "N°"
  direccion: 'F21',                // "Dirección:"
  ciudad: 'O21',                   // "Ciudad:"
  telefono: 'D23',                 // "Teléfono (s):"
  celular: 'L23',                  // "Celular:"
  email: 'R23',                    // "Email:"
  representanteLegal: 'D25',       // "Representante Legal:"
  representanteCC: 'D27',          // "C.C. N°."
  representanteFecha: 'O27',       // "de:"
  apoderadoNombre: 'H33',          // "3. Apoderado (si tiene):"
  apoderadoTP: 'X33',              // "T.P.:"
  apoderadoCC: 'D35',              // "C.C. N°."
  apoderadoFecha: 'O35',           // "de:"
  nombreProyecto: 'I43',           // "1. Nombre del proyecto (si aplica):"
  areaM2: 'V43',                   // "Área (m2):"
  direccionPredio: 'G45',          // "2. Dirección del Predio:"
  localidad: 'F47',                // "3. Localidad:"
  upz: 'M47',                      // "UPZ:"
  barrio: 'T47',                   // "Barrio:"
  chip: 'N49',                     // "4. ... CHIP:"
  matriculaInmobiliaria: 'V49',    // "Matricula inmobiliaria:"
  nombrePropietario: 'K51',        // "5. Nombre del propietario o Razón Social:"
  propietarioIdentificacion: 'J53', // "N°"
  totalArboles: 'H66',             // "Total árboles a evaluar:"
  totalVolumen: 'T66',             // "Total volumen a extraer:"
  seto1Longitud: 'G71',            // "Seto (1): Longitud (m):"
  seto1Altura: 'M71',              // "Altura (m):"
  seto1Especie: 'S71',             // "Especie:"
  seto2Longitud: 'G73',
  seto2Altura: 'M73',
  seto2Especie: 'S73',
  nombreFirmante: 'D108',          // "FIRMA DEL PROPIETARIO O APODERADO"
  fechaFirma: 'R110',              // "Fecha:"
};

// Fila base donde empieza la tabla de especies (hoja "Solicitud evaluación").
// La fila de encabezado es la 60 (C60=Especie, H60=Cantidad, N60=Actividad, T60=Volumen);
// los datos se escriben desde la fila 61 en adelante (A1, base 1-indexada).
export const F1_ESPECIES_START = 61;

// FGR-06 (Corpoboyacá) — hoja "Parte B / Parte C"
export const FGR06_MAP: Record<string, string> = {
  altitud: 'B17',
  topografia: 'Q17',            // se escribe sobre la casilla marcada (Plana/Ondulada/...)
  cuerposAgua: 'G19',            // Si/No
  cuerposAguaClase: 'L19',
  cuerposAguaNombre: 'Y19',
  cultivos: 'B25',
  rastrojo: 'F25',
  pastos: 'J25',
  proteccionAmbiental: 'N25',
  bosquePlantado: 'V25',
  industrial: 'AC25',
  otroUso: 'B27',
  areaTotalPredio: 'AC27',
  usoPrincipalPOT: 'B29',
  observaciones: 'B53',
  metodoRenovabilidad: 'J97',
  noPlantas: 'E99',
  especies: 'L99',
  firmante: 'A107',
};

// Fila base de la tabla "N°. Árboles / Nombre común / Nombre técnico / Vol."
// en Parte B (encabezado en fila 33, datos desde 34).
export const FGR06_ARBOLES_START = 34;

// FGR-29 (Corpoboyacá) — categorías de costos con filas de partidas
// (A1, 1-indexado). filaInicio = primera fila de partida, filaFin = última.
export interface FGR29Categoria {
  nombre: string;
  hoja: string;
  filaInicio: number;
  filaFin: number;
}

export const FGR29_CATEGORIAS: FGR29Categoria[] = [
  // Parte A — costos de inversión
  { nombre: '1.1 Obras Civiles (Diseño y Construcción)', hoja: 'Parte A', filaInicio: 9, filaFin: 15 },
  { nombre: '1.2 Maquinaria y Equipo', hoja: 'Parte A', filaInicio: 18, filaFin: 24 },
  { nombre: '1.3 Montaje de Equipos', hoja: 'Parte A', filaInicio: 27, filaFin: 31 },
  { nombre: '1.4 Estudios, Consultorías e Interventoría', hoja: 'Parte A', filaInicio: 34, filaFin: 37 },
  { nombre: '1.5 Otros Bienes e Inversiones', hoja: 'Parte A', filaInicio: 40, filaFin: 45 },
  // Parte B — costos de operación
  { nombre: '2.1 Materias Primas e Insumos', hoja: 'Parte B', filaInicio: 8, filaFin: 12 },
  { nombre: '2.2 Mano de Obra', hoja: 'Parte B', filaInicio: 15, filaFin: 18 },
  { nombre: '2.3 Arrendamientos, Alquileres, Servicios', hoja: 'Parte B', filaInicio: 21, filaFin: 23 },
  { nombre: '2.4 Mantenimiento, Reparación y/o Reposición', hoja: 'Parte B', filaInicio: 26, filaFin: 30 },
  { nombre: '2.5 Desmantelamiento', hoja: 'Parte B', filaInicio: 33, filaFin: 35 },
  { nombre: '2.6 Compensación Ambiental (si aplica)', hoja: 'Parte B', filaInicio: 38, filaFin: 41 },
];

export const FGR29_FIRMANTE: Record<string, string> = {
  nombre: 'C48',
  identificacion: 'C49',
  direccion: 'C50',
  telefono: 'C51',
  fecha: 'C53',
  cargo: 'C54',
};

// PM04-PR30-F2 (SDA) — ficha individual (SILV-F01). Es una matriz de
// individuos: cada árbol ocupa una fila (FILA_1..FILA_34). Mapeamos los
// campos del individuo a las columnas de la fila de captura (FILA_1).
export const F2_FILA_INDIVIDUO = 7; // A1 fila del primer individuo (FILA_1)
export const F2_MAP: Record<string, string> = {
  numeroFicha: 'C7',            // RADICADO
  especieComun: 'F7',           // CODIGO SIADAMA / NOMBRE
  dap: 'G7',                    // PAP (m)
  alturaTotal: 'I7',            // ALT. TOT (m)
  alturaFuste: 'J7',            // ALT. COM (m)
};