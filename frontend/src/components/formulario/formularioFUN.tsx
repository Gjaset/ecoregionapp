import { useState, useCallback, useEffect, ChangeEvent, FormEvent, FocusEvent } from 'react';
import { api } from '../../services/api';
import './styles/formularioFUN.css';

interface FormularioFUNData {
  // Section 1: Datos del interesado
  tipoSolicitud: 'nueva' | 'prorroga' | '';
  tipoPersona: 'natural' | 'juridicaPublica' | 'juridicaPrivada' | '';
  nombreRazonSocial: string;
  tipoIdentificacion: 'CC' | 'CE' | 'PA' | 'NIT' | '';
  numeroIdentificacion: string;
  // Apoderado (si aplica)
  apoderadoNombre: string;
  apoderadoTipoIdentificacion: 'CC' | 'CE' | 'PA' | '';
  apoderadoNumeroIdentificacion: string;
  apoderadoTP: string;
  // Calidad en que actúa sobre el predio
  calidadPredio:
    | 'propietario'
    | 'poseedor'
    | 'consejoComunitario'
    | 'tenedor'
    | 'ocupante'
    | 'resguardoIndigena'
    | 'otro'
    | 'autorizado'
    | 'enteTerritorial'
    | '';
  calidadPredioOtro: string;
  // Tipo de predio(s)
  tipoPredio: 'publico' | 'colectivo' | 'privado' | '';
  // Costo del proyecto
  costoProyecto: string;
  costoProyectoLetras: string;
  // Sección 2: Solo si es prórroga
  numeroExpediente: string;
  numeroActoAdministrativo: string;
  // Sección 3: Descripción detallada de la solicitud
  modoAdquirirDerecho:
    | 'permisoPublico'
    | 'asociacionPublico'
    | 'concesionForestalPublico'
    | 'autorizacionPrivadaColectiva'
    | '';
  // Productos forestales objeto de la solicitud
  categoriaProducto:
    | 'maderables'
    | 'floraSilvestreNoMaderables'
    | 'arbolesAislados'
    | 'guadualesBambusales'
    | '';
  // Subcategorías para maderables
  claseAprovechamientoMaderables:
    | 'persistente'
    | 'unico'
    | 'domestico'
    | 'manejoForestalUnificado'
    | '';
  // Subcategorías para flora silvestre no maderables
  claseManejoSostenible: 'domestico' | 'persistente' | '';
  ingresosMensualesSMLMV: string;
  ingresosMensualesSMLMVLetras: string;
  categoriaPersistente: 'pequenos' | 'medianos' | 'grandes' | '';
  // Subcategorías para guaduales y bambusales
  tipoAprovechamientoGuaduales:
    | 'tipo1'
    | 'tipo2'
    | 'cambioUsoSuelo'
    | 'establecimientoManejo'
    | '';
  // Sección 4: Información general del predio
  nombrePredio: string;
  superficieHa: string;
  direccionPredio: string;
  urbanoRural: 'urbano' | 'rural' | '';
  departamento: string;
  municipio: string;
  vereda: string;
  matriculaInmobiliaria: string;
  cedulaCatastral: string;
  // Sección 5: Coordenadas del área objeto de la solicitud
  tipoCoordenadas: 'planar' | 'geografica' | '';
  // Coordenadas planar (lista)
  coordenadasPlanar: Array<{
    punto: string;
    x: string;
    y: string;
  }>;
  // Coordenadas geografica (lista)
  coordenadasGeografica: Array<{
    punto: string;
    gradosLat: string;
    latitud: string;
    minutosLat: string;
    segundosLat: string;
    gradosLong: string;
    longitud: string;
    minutosLong: string;
    segundosLong: string;
    altitud: string;
    origen: string;
  }>;
  // Sección 6: Información sobre el aprovechamiento forestal o manejo sostenible
  metodoAprovechamiento: 'mecanico' | 'manual' | 'mecanicoManual' | '';
  // Especies (lista dinámica)
  especies: Array<{
    cantidad: string;
    unidadMedida: string;
    nombreComun: string;
    nombreCientifico: string;
    habitos: string;
    parteAprovechada: string;
    vedaNacionalRegional: string;
    categoriaAmenaza: string;
    usoProductos: string;
  }>;
  // Información asociada a la solicitud de aprovechamiento de árboles aislados (si aplica)
  arbolesAisladosUbicacion:
    | 'dentroCoberturaBosque'
    | 'fueraCoberturaBosque'
    | 'talaPodaEmergenciaUrbana'
    | 'obraPublicaPrivadaUrbana'
    | '';
  // Subsecciones para árboles aislados
  estadoIndividuo:
    | 'caidoCausasNaturales'
    | 'muertoCausasNaturales'
    | 'razonesFitosanitarias'
    | 'caido'
    | 'muerto'
    | 'enfermo'
    | '';
  razonesFitosanitariasEspecificar: string;
  causaPerjuicio:
    | 'estabilidadSuelos'
    | 'canalAgua'
    | 'obrasInfraestructuraEdificaciones'
    | 'otro'
    | '';
  causaPerjuicioOtro: string;
  actividadInfraestructura:
    | 'construccionRealizacion'
    | 'remodelacion'
    | 'ampliacion'
    | 'instalacion'
    | 'similares'
    | '';
  similaresEspecificar: string;
  // Sección 7: Notificacion
  notificacionElectronica: 'si' | 'no' | '';
  correoElectronico: string;
  telefonos: string;
  direccionNotificacion: string;
  municipioNotificacion: string;
  nombreCentroPobladoVeredaCorregimiento: string;
  departamentoNotificacion: string;
  // Firma del interesado
  nombreFirmante: string;
}

const initialState: FormularioFUNData = {
  tipoSolicitud: '',
  tipoPersona: '',
  nombreRazonSocial: '',
  tipoIdentificacion: '',
  numeroIdentificacion: '',
  apoderadoNombre: '',
  apoderadoTipoIdentificacion: '',
  apoderadoNumeroIdentificacion: '',
  apoderadoTP: '',
  calidadPredio: '',
  calidadPredioOtro: '',
  tipoPredio: '',
  costoProyecto: '',
  costoProyectoLetras: '',
  numeroExpediente: '',
  numeroActoAdministrativo: '',
  modoAdquirirDerecho: '',
  categoriaProducto: '',
  claseAprovechamientoMaderables: '',
  claseManejoSostenible: '',
  ingresosMensualesSMLMV: '',
  ingresosMensualesSMLMVLetras: '',
  categoriaPersistente: '',
  tipoAprovechamientoGuaduales: '',
  nombrePredio: '',
  superficieHa: '',
  direccionPredio: '',
  urbanoRural: '',
  departamento: '',
  municipio: '',
  vereda: '',
  matriculaInmobiliaria: '',
  cedulaCatastral: '',
  tipoCoordenadas: '',
  coordenadasPlanar: [],
  coordenadasGeografica: [],
  metodoAprovechamiento: '',
  especies: [{ cantidad: '', unidadMedida: '', nombreComun: '', nombreCientifico: '', habitos: '', parteAprovechada: '', vedaNacionalRegional: '', categoriaAmenaza: '', usoProductos: '' }],
  arbolesAisladosUbicacion: '',
  estadoIndividuo: '',
  razonesFitosanitariasEspecificar: '',
  causaPerjuicio: '',
  causaPerjuicioOtro: '',
  actividadInfraestructura: '',
  similaresEspecificar: '',
  notificacionElectronica: '',
  correoElectronico: '',
  telefonos: '',
  direccionNotificacion: '',
  municipioNotificacion: '',
  nombreCentroPobladoVeredaCorregimiento: '',
  departamentoNotificacion: '',
  nombreFirmante: '',
};

const FormularioFUN: React.FC = () => {
  const [formData, setFormData] = useState<FormularioFUNData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Auto-save form data to localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem('formularioFUN-draft', JSON.stringify(formData));
      } catch (e) {
        console.warn('Failed to save form data to localStorage:', e);
      }
    };

    // Debounce the save operation
    const handler = setTimeout(saveToLocalStorage, 1000);
    return () => clearTimeout(handler);
  }, [formData]);

  // Load saved draft on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('formularioFUN-draft');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      }
    } catch (e) {
      console.warn('Failed to load form data from localStorage:', e);
    }
  }, []);

  const handleChange = useCallback((
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof FormularioFUNData,
    arrayIndex?: number,
    subField?: string
  ) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    if (arrayIndex !== undefined && subField !== undefined) {
      if (field === 'especies') {
        setFormData((prev) => {
          const newEspecies = [...prev.especies];
          if (newEspecies[arrayIndex]) {
            (newEspecies[arrayIndex] as Record<string, string>)[subField] = e.target.value as string;
          }
          return { ...prev, especies: newEspecies };
        });
      } else if (field === 'coordenadasPlanar') {
        setFormData((prev) => {
          const newCoords = [...prev.coordenadasPlanar];
          if (newCoords[arrayIndex]) {
            (newCoords[arrayIndex] as Record<string, string>)[subField] = e.target.value as string;
          }
          return { ...prev, coordenadasPlanar: newCoords };
        });
      } else if (field === 'coordenadasGeografica') {
        setFormData((prev) => {
          const newCoords = [...prev.coordenadasGeografica];
          if (newCoords[arrayIndex]) {
            (newCoords[arrayIndex] as Record<string, string>)[subField] = e.target.value as string;
          }
          return { ...prev, coordenadasGeografica: newCoords };
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value as string }));
    }
  }, []);

  const addEspecie = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      especies: [
        ...prev.especies,
        {
          cantidad: '',
          unidadMedida: '',
          nombreComun: '',
          nombreCientifico: '',
          habitos: '',
          parteAprovechada: '',
          vedaNacionalRegional: '',
          categoriaAmenaza: '',
          usoProductos: '',
        },
      ],
    }));
  }, []);

  const removeEspecie = useCallback((index: number) => {
    setFormData((prev) => {
      const newEspecies = [...prev.especies];
      newEspecies.splice(index, 1);
      return { ...prev, especies: newEspecies };
    });
  }, []);

  const addCoordenadaPlanar = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      coordenadasPlanar: [
        ...prev.coordenadasPlanar,
        { punto: '', x: '', y: '' },
      ],
    }));
  }, []);

  const removeCoordenadaPlanar = useCallback((index: number) => {
    setFormData((prev) => {
      const newCoords = [...prev.coordenadasPlanar];
      newCoords.splice(index, 1);
      return { ...prev, coordenadasPlanar: newCoords };
    });
  }, []);

  const addCoordenadaGeografica = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      coordenadasGeografica: [
        ...prev.coordenadasGeografica,
        {
          punto: '',
          gradosLat: '',
          latitud: '',
          minutosLat: '',
          segundosLat: '',
          gradosLong: '',
          longitud: '',
          minutosLong: '',
          segundosLong: '',
          altitud: '',
          origen: '',
        },
      ],
    }));
  }, []);

  const removeCoordenadaGeografica = useCallback((index: number) => {
    setFormData((prev) => {
      const newCoords = [...prev.coordenadasGeografica];
      newCoords.splice(index, 1);
      return { ...prev, coordenadasGeografica: newCoords };
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FormularioFUNData, string>> = {};

    const requiredFields: (keyof FormularioFUNData)[] = [
      'tipoSolicitud',
      'tipoPersona',
      'nombreRazonSocial',
      'tipoIdentificacion',
      'numeroIdentificacion',
      'calidadPredio',
      'tipoPredio',
      'costoProyecto',
      'costoProyectoLetras',
      'modoAdquirirDerecho',
      'categoriaProducto',
      'metodoAprovechamiento',
      'nombrePredio',
      'superficieHa',
      'direccionPredio',
      'urbanoRural',
      'departamento',
      'municipio',
      'nombreFirmante',
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      ) {
        newErrors[field] = 'Este campo es requerido';
      }
    });

    if (formData.tipoSolicitud === 'prorroga') {
      if (!formData.numeroExpediente.trim()) {
        newErrors.numeroExpediente = 'Requerido para prórroga';
      }
      if (!formData.numeroActoAdministrativo.trim()) {
        newErrors.numeroActoAdministrativo = 'Requerido para prórroga';
      }
    }

    if (formData.calidadPredio === 'otro' && !formData.calidadPredioOtro.trim()) {
      newErrors.calidadPredioOtro = 'Especifique cuál';
    }

    // Improved currency validation
    if (typeof formData.costoProyecto === 'string' && formData.costoProyecto.trim()) {
      // Allow formats like: 1.000.000,00 or 1,000,000.00 or 1000000.00
      const cleanedValue = formData.costoProyecto.replace(/[.\s]/g, '').replace(',', '.');
      if (!/^\d+(\.\d{1,2})?$/.test(cleanedValue)) {
        newErrors.costoProyecto = 'Ingrese un número válido (formato: 1.000.000,00)';
      }
    }

    if (formData.tipoCoordenadas === 'planar' && formData.coordenadasPlanar.length === 0) {
      newErrors.tipoCoordenadas = 'Debe agregar al menos un punto de coordenadas';
    }
    if (formData.tipoCoordenadas === 'geografica' && formData.coordenadasGeografica.length === 0) {
      newErrors.tipoCoordenadas = 'Debe agregar al menos un punto de coordenadas';
    }

    if (formData.especies.length === 0) {
      newErrors.especies = 'Debe agregar al menos una especie';
    } else {
      formData.especies.forEach((esp, index) => {
        if (!esp.cantidad.trim()) {
          (newErrors as Record<string, string>)[`especies[${index}].cantidad`] = 'Requerido';
        }
        if (!esp.nombreComun.trim()) {
          (newErrors as Record<string, string>)[`especies[${index}].nombreComun`] = 'Requerido';
        }
        if (!esp.nombreCientifico.trim()) {
          (newErrors as Record<string, string>)[`especies[${index}].nombreCientifico`] = 'Requerido';
        }
        // Validate that cantidad is a positive number
        if (esp.cantidad.trim() && !/^\d+(\.\d+)?$/.test(esp.cantidad.trim())) {
          (newErrors as Record<string, string>)[`especies[${index}].cantidad`] = 'Debe ser un número positivo';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Real-time validation on blur
  const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof FormularioFUNData) => {
    // Validate individual field on blur for better UX
    const value = formData[field];

    // Skip validation for empty values in some cases
    if (typeof value === 'string' && !value.trim() &&
        !['tipoSolicitud', 'tipoPersona', 'nombreRazonSocial', 'tipoIdentificacion',
          'numeroIdentificacion', 'calidadPredio', 'tipoPredio', 'costoProyecto',
          'costoProyectoLetras', 'modoAdquirirDerecho', 'categoriaProducto',
          'metodoAprovechamiento', 'nombrePredio', 'superficieHa', 'direccionPredio',
          'urbanoRural', 'departamento', 'municipio', 'nombreFirmante'].includes(field)) {
      return;
    }

    // Validate the specific field
    const fieldErrors: Partial<Record<keyof FormularioFUNData, string>> = {};

    // Required field check
    if (
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      const requiredFields: (keyof FormularioFUNData)[] = [
        'tipoSolicitud',
        'tipoPersona',
        'nombreRazonSocial',
        'tipoIdentificacion',
        'numeroIdentificacion',
        'calidadPredio',
        'tipoPredio',
        'costoProyecto',
        'costoProyectoLetras',
        'modoAdquirirDerecho',
        'categoriaProducto',
        'metodoAprovechamiento',
        'nombrePredio',
        'superficieHa',
        'direccionPredio',
        'urbanoRural',
        'departamento',
        'municipio',
        'nombreFirmante',
      ];

      if (requiredFields.includes(field)) {
        fieldErrors[field] = 'Este campo es requerido';
      }
    }

    // Special validations
    if (field === 'costoProyecto' && typeof value === 'string' && value.trim()) {
      const cleanedValue = value.replace(/[.\s]/g, '').replace(',', '.');
      if (!/^\d+(\.\d{1,2})?$/.test(cleanedValue)) {
        fieldErrors[field] = 'Ingrese un número válido (formato: 1.000.000,00)';
      }
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  }, [formData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setDownloading(true);
    try {
      const blob = await api.exportarFunPdf(formData);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'formato_unico_nacional.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setSubmitSuccess(true);
    } catch (err: unknown) {
      setSubmitSuccess(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { status: number; statusText: string } }).response;
        setSubmitError(
          response?.status === 401
            ? 'Inicia sesión para exportar el PDF. Tus datos se conservan en el borrador.'
            : response
              ? `Error ${response.status}: ${response.statusText}`
              : 'Error desconocido'
        );
      } else if (err && typeof err === 'object' && 'request' in err) {
        setSubmitError('Error de conexión. Verifique su internet y que el backend esté disponible.');
      } else if (err instanceof Error) {
        setSubmitError(err.message || 'Error desconocido');
      } else {
        setSubmitError('Error desconocido');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-fun">
      {/* Visually hidden error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div className="sr-only" role="alert">
          <h2>Errores de validación</h2>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{String(field)}: {message}</li>
            ))}
          </ul>
        </div>
      )}
      <header className="form-header">
        <h1>Formato Único Nacional de Solicitud de Aprovechamiento Forestal y Manejo Sostenible de Flora Silvestre y Productos Forestales No Maderables</h1>
        <p>Nuevo/Prórroga</p>
      </header>

      {/* Sección 1: Datos del interesado */}
      <section className="form-section">
        <div className="section-heading">
          <h2>1. Datos del interesado</h2>
        </div>
        <div className="section-fields">
          <div className="field">
            <label>1.1. Tipo de Solicitud <b>*</b></label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="nueva"
                  checked={formData.tipoSolicitud === 'nueva'}
                  onChange={(e) => handleChange(e, 'tipoSolicitud')}
                  onBlur={(e) => handleBlur(e, 'tipoSolicitud')}
                />
                Nueva
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="prorroga"
                  checked={formData.tipoSolicitud === 'prorroga'}
                  onChange={(e) => handleChange(e, 'tipoSolicitud')}
                  onBlur={(e) => handleBlur(e, 'tipoSolicitud')}
                />
                Prórroga
              </label>
            </div>
            {errors.tipoSolicitud && <p className="field-error">{errors.tipoSolicitud}</p>}
          </div>

          <div>
            <label className="field">
              1.2. Tipo de persona <b>*</b>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="natural"
                  checked={formData.tipoPersona === 'natural'}
                  onChange={(e) => handleChange(e, 'tipoPersona')}
                  onBlur={(e) => handleBlur(e, 'tipoPersona')}
                />
                Natural
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="juridicaPublica"
                  checked={formData.tipoPersona === 'juridicaPublica'}
                  onChange={(e) => handleChange(e, 'tipoPersona')}
                  onBlur={(e) => handleBlur(e, 'tipoPersona')}
                />
                Jurídica Pública
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="juridicaPrivada"
                  checked={formData.tipoPersona === 'juridicaPrivada'}
                  onChange={(e) => handleChange(e, 'tipoPersona')}
                  onBlur={(e) => handleBlur(e, 'tipoPersona')}
                />
                Jurídica Privada
              </label>
            </div>
            {errors.tipoPersona && (
              <p className="field-error">{errors.tipoPersona}</p>
            )}
          </div>
        </div>

          <div className="field field-wide">
            <label>Nombre o Razón Social <b>*</b></label>
            <input
              type="text"
              value={formData.nombreRazonSocial}
              onChange={(e) => handleChange(e, 'nombreRazonSocial')}
              onBlur={(e) => handleBlur(e, 'nombreRazonSocial')}
              placeholder="Ej. ECO REGIÓN SAS BIC"
              aria-invalid={!!errors.nombreRazonSocial}
              aria-describedby={errors.nombreRazonSocial ? `error-nombreRazonSocial` : undefined}
            />
            {errors.nombreRazonSocial && (
              <p id="error-nombreRazonSocial" className="field-error">{errors.nombreRazonSocial}</p>
            )}
          </div>

          <div className="section-fields">
            <div className="field">
              <label>Tipo de identificación <b>*</b></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="CC"
                    checked={formData.tipoIdentificacion === 'CC'}
                    onChange={(e) => handleChange(e, 'tipoIdentificacion')}
                    onBlur={(e) => handleBlur(e, 'tipoIdentificacion')}
                  />
                  CC
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="CE"
                    checked={formData.tipoIdentificacion === 'CE'}
                    onChange={(e) => handleChange(e, 'tipoIdentificacion')}
                    onBlur={(e) => handleBlur(e, 'tipoIdentificacion')}
                  />
                  CE
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="PA"
                    checked={formData.tipoIdentificacion === 'PA'}
                    onChange={(e) => handleChange(e, 'tipoIdentificacion')}
                    onBlur={(e) => handleBlur(e, 'tipoIdentificacion')}
                  />
                  PA
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="NIT"
                    checked={formData.tipoIdentificacion === 'NIT'}
                    onChange={(e) => handleChange(e, 'tipoIdentificacion')}
                    onBlur={(e) => handleBlur(e, 'tipoIdentificacion')}
                  />
                  NIT
                </label>
              </div>
              {errors.tipoIdentificacion && <p className="field-error">{errors.tipoIdentificacion}</p>}
            </div>

            <div className="field">
              <label>Número de Identificación <b>*</b></label>
              <input
                type="text"
                value={formData.numeroIdentificacion}
                onChange={(e) => handleChange(e, 'numeroIdentificacion')}
                onBlur={(e) => handleBlur(e, 'numeroIdentificacion')}
                placeholder="Ej. 1234567890"
                aria-invalid={!!errors.numeroIdentificacion}
                aria-describedby={errors.numeroIdentificacion ? `error-numeroIdentificacion` : undefined}
              />
              {errors.numeroIdentificacion && (
                <p id="error-numeroIdentificacion" className="field-error">{errors.numeroIdentificacion}</p>
              )}
            </div>
          </div>

        {/* Apoderado (si aplica) */}
        <div className="section-fields apoderado-grid" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              value={formData.apoderadoNombre}
              onChange={(e) => handleChange(e, 'apoderadoNombre')}
              onBlur={(e) => handleBlur(e, 'apoderadoNombre')}
              placeholder="Nombre completo del apoderado"
              aria-invalid={!!errors.apoderadoNombre}
              aria-describedby={errors.apoderadoNombre ? `error-apoderadoNombre` : undefined}
            />
            {errors.apoderadoNombre && (
              <p id="error-apoderadoNombre" className="field-error">{errors.apoderadoNombre}</p>
            )}
          </div>
          <div className="field">
            <label>Tipo de identificación</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="CC"
                  checked={formData.apoderadoTipoIdentificacion === 'CC'}
                  onChange={(e) => handleChange(e, 'apoderadoTipoIdentificacion')}
                  onBlur={(e) => handleBlur(e, 'apoderadoTipoIdentificacion')}
                />
                CC
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="CE"
                  checked={formData.apoderadoTipoIdentificacion === 'CE'}
                  onChange={(e) => handleChange(e, 'apoderadoTipoIdentificacion')}
                  onBlur={(e) => handleBlur(e, 'apoderadoTipoIdentificacion')}
                />
                CE
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="PA"
                  checked={formData.apoderadoTipoIdentificacion === 'PA'}
                  onChange={(e) => handleChange(e, 'apoderadoTipoIdentificacion')}
                  onBlur={(e) => handleBlur(e, 'apoderadoTipoIdentificacion')}
                />
                PA
              </label>
            </div>
          </div>
          <div className="field">
            <label>Número de Identificación</label>
            <input
              type="text"
              value={formData.apoderadoNumeroIdentificacion}
              onChange={(e) => handleChange(e, 'apoderadoNumeroIdentificacion')}
              onBlur={(e) => handleBlur(e, 'apoderadoNumeroIdentificacion')}
              placeholder="Número de identificación"
              aria-invalid={!!errors.apoderadoNumeroIdentificacion}
              aria-describedby={errors.apoderadoNumeroIdentificacion ? `error-apoderadoNumeroIdentificacion` : undefined}
            />
            {errors.apoderadoNumeroIdentificacion && (
              <p id="error-apoderadoNumeroIdentificacion" className="field-error">{errors.apoderadoNumeroIdentificacion}</p>
            )}
          </div>
          <div className="field">
            <label>TP (Tarjeta Profesional)</label>
            <input
              type="text"
              value={formData.apoderadoTP}
              onChange={(e) => handleChange(e, 'apoderadoTP')}
              onBlur={(e) => handleBlur(e, 'apoderadoTP')}
              placeholder="Número de tarjeta profesional"
              aria-invalid={!!errors.apoderadoTP}
              aria-describedby={errors.apoderadoTP ? `error-apoderadoTP` : undefined}
            />
            {errors.apoderadoTP && (
              <p id="error-apoderadoTP" className="field-error">{errors.apoderadoTP}</p>
            )}
          </div>
        </div>

        {/* Calidad en que actúa sobre el predio */}
        <div className="section-fields">
          <div className="field field-wide">
            <label>1.4. Calidad en que actúa sobre el predio donde se realizará el aprovechamiento o manejo sostenible. (Ver instructivo): <b>*</b></label>
            <div className="calidad-grid">
              <label className="calidad-label">
                <input
                  type="radio"
                  value="propietario"
                  checked={formData.calidadPredio === 'propietario'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Propietario
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="poseedor"
                  checked={formData.calidadPredio === 'poseedor'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Poseedor
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="consejoComunitario"
                  checked={formData.calidadPredio === 'consejoComunitario'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Consejo comunitario
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="tenedor"
                  checked={formData.calidadPredio === 'tenedor'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Tenedor
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="ocupante"
                  checked={formData.calidadPredio === 'ocupante'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Ocupante
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="resguardoIndigena"
                  checked={formData.calidadPredio === 'resguardoIndigena'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Resguardo indígena
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="otro"
                  checked={formData.calidadPredio === 'otro'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Otro
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="autorizado"
                  checked={formData.calidadPredio === 'autorizado'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Autorizado
              </label>
              <label className="calidad-label">
                <input
                  type="radio"
                  value="enteTerritorial"
                  checked={formData.calidadPredio === 'enteTerritorial'}
                  onChange={(e) => handleChange(e, 'calidadPredio')}
                  onBlur={(e) => handleBlur(e, 'calidadPredio')}
                />
                Ente territorial
              </label>
            </div>
            {errors.calidadPredio && <p className="field-error">{errors.calidadPredio}</p>}
            {formData.calidadPredio === 'otro' && (
              <div className="field">
                <label>Especifique cuál:</label>
                <input
                  type="text"
                  value={formData.calidadPredioOtro}
                  onChange={(e) => handleChange(e, 'calidadPredioOtro')}
                  onBlur={(e) => handleBlur(e, 'calidadPredioOtro')}
                  placeholder="Ej. Comunidad indígena"
                  aria-invalid={!!errors.calidadPredioOtro}
                  aria-describedby={errors.calidadPredioOtro ? `error-calidadPredioOtro` : undefined}
                />
                {errors.calidadPredioOtro && (
                  <p id="error-calidadPredioOtro" className="field-error">{errors.calidadPredioOtro}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tipo de predio(s) */}
        <div className="section-fields">
          <div className="field field-wide">
            <label>1.5. Información del predio objeto de la solicitud: <b>*</b></label>
            <div className="tipo-predio-group">
              <label className="tipo-predio-label">
                <input
                  type="radio"
                  value="publico"
                  checked={formData.tipoPredio === 'publico'}
                  onChange={(e) => handleChange(e, 'tipoPredio')}
                  onBlur={(e) => handleBlur(e, 'tipoPredio')}
                />
                Público
              </label>
              <label className="tipo-predio-label">
                <input
                  type="radio"
                  value="colectivo"
                  checked={formData.tipoPredio === 'colectivo'}
                  onChange={(e) => handleChange(e, 'tipoPredio')}
                  onBlur={(e) => handleBlur(e, 'tipoPredio')}
                />
                Colectivo
              </label>
              <label className="tipo-predio-label">
                <input
                  type="radio"
                  value="privado"
                  checked={formData.tipoPredio === 'privado'}
                  onChange={(e) => handleChange(e, 'tipoPredio')}
                  onBlur={(e) => handleBlur(e, 'tipoPredio')}
                />
                Privado
              </label>
            </div>
            {errors.tipoPredio && <p className="field-error">{errors.tipoPredio}</p>}
          </div>
        </div>

        {/* Costo del proyecto */}
        <div className="section-fields">
          <div className="field field-wide">
            <label>1.6. Costo del Proyecto, Obra o Actividad (Si aplica): <b>*</b></label>
          </div>
          <div className="field">
            <label>Costo (en números):</label>
            <input
              type="text"
              value={formData.costoProyecto}
              onChange={(e) => handleChange(e, 'costoProyecto')}
              onBlur={(e) => handleBlur(e, 'costoProyecto')}
              placeholder="Ej. 20.568.708.950"
              aria-invalid={!!errors.costoProyecto}
              aria-describedby={errors.costoProyecto ? `error-costoProyecto` : undefined}
            />
            {errors.costoProyecto && (
              <p id="error-costoProyecto" className="field-error">{errors.costoProyecto}</p>
            )}
          </div>
          <div className="field">
            <label>Valor en letras:</label>
            <input
              type="text"
              value={formData.costoProyectoLetras}
              onChange={(e) => handleChange(e, 'costoProyectoLetras')}
              onBlur={(e) => handleBlur(e, 'costoProyectoLetras')}
              placeholder="Veinte mil quinientos sesenta y ocho millones setecientos ocho"
              aria-invalid={!!errors.costoProyectoLetras}
              aria-describedby={errors.costoProyectoLetras ? `error-costoProyectoLetras` : undefined}
            />
            {errors.costoProyectoLetras && (
              <p id="error-costoProyectoLetras" className="field-error">{errors.costoProyectoLetras}</p>
            )}
          </div>
        </div>
      </section>

      {/* Sección 2: Solo si es prórroga */}
      {formData.tipoSolicitud === 'prorroga' && (
        <section className="form-section">
          <div className="section-heading">
            <h2>2. Si es una prórroga de un aprovechamiento o manejo sostenible aprobado</h2>
          </div>
          <div className="section-fields">
            <div className="field field-wide">
              <label>Indique el número del expediente: <b>*</b></label>
              <input
                type="text"
                value={formData.numeroExpediente}
                onChange={(e) => handleChange(e, 'numeroExpediente')}
                onBlur={(e) => handleBlur(e, 'numeroExpediente')}
                placeholder="Ej. EXP-2023-001"
                aria-invalid={!!errors.numeroExpediente}
                aria-describedby={errors.numeroExpediente ? `error-numeroExpediente` : undefined}
              />
              {errors.numeroExpediente && (
                <p id="error-numeroExpediente" className="field-error">{errors.numeroExpediente}</p>
              )}
            </div>
            <div className="field field-wide">
              <label>Indique el número de acto administrativo mediante el cual se otorgó el derecho al uso del recurso forestal (permiso, asociación, concesión forestal o autorización): <b>*</b></label>
              <input
                type="text"
                value={formData.numeroActoAdministrativo}
                onChange={(e) => handleChange(e, 'numeroActoAdministrativo')}
                onBlur={(e) => handleBlur(e, 'numeroActoAdministrativo')}
                placeholder="Ej. RESOLUCIÓN 123/2023"
                aria-invalid={!!errors.numeroActoAdministrativo}
                aria-describedby={errors.numeroActoAdministrativo ? `error-numeroActoAdministrativo` : undefined}
              />
              {errors.numeroActoAdministrativo && (
                <p id="error-numeroActoAdministrativo" className="field-error">{errors.numeroActoAdministrativo}</p>
              )}
            </div>
          </div>
          <p style={{ marginTop: '16px', color: 'var(--ink-soft)', fontSize: '13px' }}>
            Nota: En caso de prórroga no diligencie los numerales 3, 4 y 5
          </p>
        </section>
      )}

      {/* Sección 3: Descripción detallada de la solicitud */}
      {formData.tipoSolicitud !== 'prorroga' && (
        <>
          <section className="form-section">
            <h2 className="section-heading">3. Descripción detallada de la solicitud</h2>

            {/* 3.1 Modo de adquirir el derecho al uso del recurso */}
            <div >
              <label className="field">
                3.1. Modo de adquirir el derecho al uso del recurso (ver instructivo): <b>*</b>
              </label>
              <div className="section-fields">
                <div>
                  <label className="field">Terrenos de dominio público:</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="permisoPublico"
                        checked={formData.modoAdquirirDerecho === 'permisoPublico'}
                        onChange={(e) => handleChange(e, 'modoAdquirirDerecho')}
                        onBlur={(e) => handleBlur(e, 'modoAdquirirDerecho')}

                      />
                      Permiso
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="asociacionPublico"
                        checked={formData.modoAdquirirDerecho === 'asociacionPublico'}
                        onChange={(e) => handleChange(e, 'modoAdquirirDerecho')}
                        onBlur={(e) => handleBlur(e, 'modoAdquirirDerecho')}

                      />
                      Asociación
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="concesionForestalPublico"
                        checked={formData.modoAdquirirDerecho === 'concesionForestalPublico'}
                        onChange={(e) => handleChange(e, 'modoAdquirirDerecho')}
                        onBlur={(e) => handleBlur(e, 'modoAdquirirDerecho')}

                      />
                      Concesión Forestal
                    </label>
                  </div>
                </div>
                <div>
                  <label className="field">Predios de propiedad privada o colectiva:</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="autorizacionPrivadaColectiva"
                        checked={formData.modoAdquirirDerecho === 'autorizacionPrivadaColectiva'}
                        onChange={(e) => handleChange(e, 'modoAdquirirDerecho')}
                        onBlur={(e) => handleBlur(e, 'modoAdquirirDerecho')}

                      />
                      Autorización
                    </label>
                  </div>
                </div>
              </div>
              {errors.modoAdquirirDerecho && (
                <p className="field-error">{errors.modoAdquirirDerecho}</p>
              )}
            </div>

            {/* 3.2 Productos forestales objeto de la solicitud */}
            <div >
              <label className="field">
                3.2. Productos forestales objeto de la solicitud de aprovechamiento o manejo sostenible (ver instructivo): <b>*</b>
              </label>
              <div >
                <label className="field">De acuerdo con el tipo de solicitud a presentar, marque con una “X” la categoría respectiva:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="maderables"
                      checked={formData.categoriaProducto === 'maderables'}
                      onChange={(e) => handleChange(e, 'categoriaProducto')}
                      onBlur={(e) => handleBlur(e, 'categoriaProducto')}

                    />
                    A. Productos forestales maderables
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="floraSilvestreNoMaderables"
                      checked={formData.categoriaProducto === 'floraSilvestreNoMaderables'}
                      onChange={(e) => handleChange(e, 'categoriaProducto')}
                      onBlur={(e) => handleBlur(e, 'categoriaProducto')}

                    />
                    B. Manejo Sostenible de Flora Silvestre y los Productos Forestales No Maderables
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="arbolesAislados"
                      checked={formData.categoriaProducto === 'arbolesAislados'}
                      onChange={(e) => handleChange(e, 'categoriaProducto')}
                      onBlur={(e) => handleBlur(e, 'categoriaProducto')}

                    />
                    C. Árboles Aislados
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="guadualesBambusales"
                      checked={formData.categoriaProducto === 'guadualesBambusales'}
                      onChange={(e) => handleChange(e, 'categoriaProducto')}
                      onBlur={(e) => handleBlur(e, 'categoriaProducto')}

                    />
                    D. Guaduales y bambusales
                  </label>
                </div>
              </div>

              {/* Subsecciones según categoría */}
              {formData.categoriaProducto === 'maderables' && (
                <div >
                  <label className="field">
                    Seleccione la clase de aprovechamiento a solicitar: <b>*</b>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="persistente"
                        checked={formData.claseAprovechamientoMaderables === 'persistente'}
                        onChange={(e) => handleChange(e, 'claseAprovechamientoMaderables')}
                        onBlur={(e) => handleBlur(e, 'claseAprovechamientoMaderables')}

                      />
                      Persistente
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="unico"
                        checked={formData.claseAprovechamientoMaderables === 'unico'}
                        onChange={(e) => handleChange(e, 'claseAprovechamientoMaderables')}
                        onBlur={(e) => handleBlur(e, 'claseAprovechamientoMaderables')}

                      />
                      Único
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="domestico"
                        checked={formData.claseAprovechamientoMaderables === 'domestico'}
                        onChange={(e) => handleChange(e, 'claseAprovechamientoMaderables')}
                        onBlur={(e) => handleBlur(e, 'claseAprovechamientoMaderables')}

                      />
                      Doméstico
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="manejoForestalUnificado"
                        checked={formData.claseAprovechamientoMaderables === 'manejoForestalUnificado'}
                        onChange={(e) => handleChange(e, 'claseAprovechamientoMaderables')}
                        onBlur={(e) => handleBlur(e, 'claseAprovechamientoMaderables')}

                      />
                      Manejo Forestal Unificado
                    </label>
                  </div>
                  {errors.claseAprovechamientoMaderables && (
                    <p className="field-error">{errors.claseAprovechamientoMaderables}</p>
                  )}
                </div>
              )}
              {formData.categoriaProducto === 'floraSilvestreNoMaderables' && (
                <div >
                  <label className="field">
                    Seleccione la clase de manejo sostenible a solicitar: <b>*</b>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="domestico"
                        checked={formData.claseManejoSostenible === 'domestico'}
                        onChange={(e) => handleChange(e, 'claseManejoSostenible')}
                        onBlur={(e) => handleBlur(e, 'claseManejoSostenible')}

                      />
                      Doméstico
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="persistente"
                        checked={formData.claseManejoSostenible === 'persistente'}
                        onChange={(e) => handleChange(e, 'claseManejoSostenible')}
                        onBlur={(e) => handleBlur(e, 'claseManejoSostenible')}

                      />
                      Persistente
                    </label>
                  </div>
                  {errors.claseManejoSostenible && (
                    <p className="field-error">{errors.claseManejoSostenible}</p>
                  )}
                  {formData.claseManejoSostenible === 'persistente' && (
                    <div >
                      <label className="field">
                        Ingresos mensuales en Salarios Mínimos Legales Mensuales Vigentes – (SMLMV) esperados para la actividad comercial que se pretende desarrollar: <b>*</b>
                      </label>
                      <div className="section-fields">
                        <div>
                          <input
                            type="text"
                            value={formData.ingresosMensualesSMLMV}
                            onChange={(e) => handleChange(e, 'ingresosMensualesSMLMV')}
                            placeholder="Ej. 15.5"
                            
                          />
                          {errors.ingresosMensualesSMLMV && (
                            <p className="field-error">{errors.ingresosMensualesSMLMV}</p>
                          )}
                        </div>
                        <div>
                          <label className="field">Valor en letras:</label>
                          <input
                            type="text"
                            value={formData.ingresosMensualesSMLMVLetras}
                            onChange={(e) => handleChange(e, 'ingresosMensualesSMLMVLetras')}
                            placeholder="Quince punto cinco"
                            
                          />
                          {errors.ingresosMensualesSMLMVLetras && (
                            <p className="field-error">{errors.ingresosMensualesSMLMVLetras}</p>
                          )}
                        </div>
                      </div>
                      <label className="block text-sm font-medium mb-1 mt-4">
                        En caso de que se seleccione la clase de manejo sostenible persistente, indique la categoría asociada: <b>*</b>
                      </label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            value="pequenos"
                            checked={formData.categoriaPersistente === 'pequenos'}
                            onChange={(e) => handleChange(e, 'categoriaPersistente')}
                            onBlur={(e) => handleBlur(e, 'categoriaPersistente')}

                          />
                          Pequeños (1 a 10 SMLMV)
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            value="medianos"
                            checked={formData.categoriaPersistente === 'medianos'}
                            onChange={(e) => handleChange(e, 'categoriaPersistente')}
                            onBlur={(e) => handleBlur(e, 'categoriaPersistente')}

                          />
                          Medianos (10.1 a 30 SMLMV)
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            value="grandes"
                            checked={formData.categoriaPersistente === 'grandes'}
                            onChange={(e) => handleChange(e, 'categoriaPersistente')}
                            onBlur={(e) => handleBlur(e, 'categoriaPersistente')}

                          />
                          Grandes ({'>'}30 SMLMV)
                        </label>
                      </div>
                      {errors.categoriaPersistente && (
                        <p className="field-error">{errors.categoriaPersistente}</p>
                      )}
                    </div>)}

                  </div>
                )}
              {formData.categoriaProducto === 'arbolesAislados' && (
                <div >
                  <p className="text-sm text-gray-500">
                    No se requieren subcampos adicionales para esta categoría.
                  </p>
                </div>
              )}
              {formData.categoriaProducto === 'guadualesBambusales' && (
                <div >
                  <label className="field">
                    Seleccione el tipo de aprovechamiento a solicitar: <b>*</b>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="tipo1"
                        checked={formData.tipoAprovechamientoGuaduales === 'tipo1'}
                        onChange={(e) => handleChange(e, 'tipoAprovechamientoGuaduales')}
                        onBlur={(e) => handleBlur(e, 'tipoAprovechamientoGuaduales')}

                      />
                      Tipo 1
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="tipo2"
                        checked={formData.tipoAprovechamientoGuaduales === 'tipo2'}
                        onChange={(e) => handleChange(e, 'tipoAprovechamientoGuaduales')}
                        onBlur={(e) => handleBlur(e, 'tipoAprovechamientoGuaduales')}

                      />
                      Tipo 2
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="cambioUsoSuelo"
                        checked={formData.tipoAprovechamientoGuaduales === 'cambioUsoSuelo'}
                        onChange={(e) => handleChange(e, 'tipoAprovechamientoGuaduales')}
                        onBlur={(e) => handleBlur(e, 'tipoAprovechamientoGuaduales')}

                      />
                      Cambio definitivo de uso del suelo
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="establecimientoManejo"
                        checked={formData.tipoAprovechamientoGuaduales === 'establecimientoManejo'}
                        onChange={(e) => handleChange(e, 'tipoAprovechamientoGuaduales')}
                        onBlur={(e) => handleBlur(e, 'tipoAprovechamientoGuaduales')}

                      />
                      Establecimiento y Manejo
                    </label>
                  </div>
                  {errors.tipoAprovechamientoGuaduales && (
                    <p className="field-error">{errors.tipoAprovechamientoGuaduales}</p>
                  )}
                </div>
              )}
            </div>
        </section>
      </>

      )}

      {/* Sección 4: Información general del predio */}
      <section className="form-section">
        <h2 className="section-heading">4. Información general del predio</h2>
        <div className="space-y-4">
          {/* 4.1 Información del (los) predio(s) a intervenir */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">4.1. Información del (los) predio(s) a intervenir:</h3>
            <div className="section-fields">
              <div>
                <label className="field">
                  Nombre del predio: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.nombrePredio}
                  onChange={(e) => handleChange(e, 'nombrePredio')}
                  placeholder="Ej. Finca El Roble"
                  
                />
                {errors.nombrePredio && (
                  <p className="field-error">{errors.nombrePredio}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Superficie (ha): <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.superficieHa}
                  onChange={(e) => handleChange(e, 'superficieHa')}
                  placeholder="Ej. 15.5"
                  
                />
                {errors.superficieHa && (
                  <p className="field-error">{errors.superficieHa}</p>
                )}
              </div>
            </div>
            <div className="section-fields">
              <div>
                <label className="field">
                  Dirección del predio: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.direccionPredio}
                  onChange={(e) => handleChange(e, 'direccionPredio')}
                  placeholder="Ej. Vereda La Esperanza, km 12 vía a San Vicente"
                  
                />
                {errors.direccionPredio && (
                  <p className="field-error">{errors.direccionPredio}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Urbano/Rural: <b>*</b>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="urbano"
                      checked={formData.urbanoRural === 'urbano'}
                      onChange={(e) => handleChange(e, 'urbanoRural')}
                      
                    />
                    Urbano
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="rural"
                      checked={formData.urbanoRural === 'rural'}
                      onChange={(e) => handleChange(e, 'urbanoRural')}
                      
                    />
                    Rural
                  </label>
                </div>
                {errors.urbanoRural && (
                  <p className="field-error">{errors.urbanoRural}</p>
                )}
              </div>
            </div>
            <div className="section-fields">
              <div>
                <label className="field">
                  Departamento: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.departamento}
                  onChange={(e) => handleChange(e, 'departamento')}
                  placeholder="Ej. Antioquia"
                  
                />
                {errors.departamento && (
                  <p className="field-error">{errors.departamento}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Municipio: <b>*</b>
                </label>
                {errors.municipio && (
                  <p className="field-error">{errors.municipio}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Vereda: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.vereda}
                  onChange={(e) => handleChange(e, 'vereda')}
                  placeholder="Ej. La Esperanza"
                  
                />
                {errors.vereda && (
                  <p className="field-error">{errors.vereda}</p>
                )}
              </div>
            </div>
            <div className="section-fields">
              <div>
                <label className="field">
                  Número(s) de matrícula inmobiliaria: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.matriculaInmobiliaria}
                  onChange={(e) => handleChange(e, 'matriculaInmobiliaria')}
                  placeholder="Ej. 123-456789"
                  
                />
                {errors.matriculaInmobiliaria && (
                  <p className="field-error">{errors.matriculaInmobiliaria}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Cédula Catastral (solo si no dispone de la matrícula inmobiliaria): <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.cedulaCatastral}
                  onChange={(e) => handleChange(e, 'cedulaCatastral')}
                  placeholder="Ej. 123-456789"
                  
                />
                {errors.cedulaCatastral && (
                  <p className="field-error">{errors.cedulaCatastral}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Coordenadas del área objeto de la solicitud */}
      <section className="form-section">
        <h2 className="section-heading">5. Coordenadas del área objeto de la solicitud</h2>
        <div className="mb-4">
          <label className="field">
            Tipo de coordenadas: <b>*</b>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="planar"
                checked={formData.tipoCoordenadas === 'planar'}
                onChange={(e) => handleChange(e, 'tipoCoordenadas')}
                
              />
              Coordenadas planas
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="geografica"
                checked={formData.tipoCoordenadas === 'geografica'}
                onChange={(e) => handleChange(e, 'tipoCoordenadas')}
                
              />
              Coordenadas geográficas
            </label>
          </div>
          {errors.tipoCoordenadas && (
            <p className="field-error">{errors.tipoCoordenadas}</p>
          )}
        </div>

        {/* Coordenadas planar list */}
        {formData.tipoCoordenadas === 'planar' && (
          <div >
            <h3 className="text-sm font-medium text-gray-600">Coordenadas Planas (Origen único CTM-12):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Punto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">X</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Y</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.coordenadasPlanar.map((coord, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.punto}
                          onChange={(e) => handleChange(e, 'coordenadasPlanar', index, 'punto')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.x}
                          onChange={(e) => handleChange(e, 'coordenadasPlanar', index, 'x')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.y}
                          onChange={(e) => handleChange(e, 'coordenadasPlanar', index, 'y')}
                          
                        />
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        {formData.coordenadasPlanar.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCoordenadaPlanar(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {formData.coordenadasPlanar.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                        No hay puntos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div >
              <button
                type="button"
                onClick={addCoordenadaPlanar}
                className="text-blue-600 hover:text-blue-800"
              >
                Agregar punto de coordenadas
              </button>
            </div>
            {errors.tipoCoordenadas === 'planar' && formData.coordenadasPlanar.length === 0 && (
              <p className="field-error">Debe agregar al menos un punto de coordenadas</p>
            )}
          </div>
        )}

        {/* Coordenadas geografica list */}
        {formData.tipoCoordenadas === 'geografica' && (
          <div >
            <h3 className="text-sm font-medium text-gray-600">Coordenadas Geográficas (Sistema Magna-Sirgas):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Punto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grados Lat</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Latitud</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Minutos Lat</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Segundos Lat</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grados Long</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Longitud</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Minutos Long</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Segundos Long</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Altitud (msnm)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Origen</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.coordenadasGeografica.map((coord, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.punto}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'punto')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.gradosLat}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'gradosLat')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.latitud}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'latitud')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.minutosLat}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'minutosLat')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.longitud}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'longitud')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.minutosLong}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'minutosLong')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.segundosLong}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'segundosLong')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.altitud}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'altitud')}
                          
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={coord.origen}
                          onChange={(e) => handleChange(e, 'coordenadasGeografica', index, 'origen')}
                          
                        />
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        {formData.coordenadasGeografica.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCoordenadaGeografica(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {formData.coordenadasGeografica.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-2 text-center text-gray-500">
                        No hay puntos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div >
              <button
                type="button"
                onClick={addCoordenadaGeografica}
                className="text-blue-600 hover:text-blue-800"
              >
                Agregar punto de coordenadas
              </button>
            </div>
            {errors.tipoCoordenadas === 'geografica' && formData.coordenadasGeografica.length === 0 && (
              <p className="field-error">Debe agregar al menos un punto de coordenadas</p>
            )}
          </div>
        )}
      </section>

      {/* Sección 6: Información sobre el aprovechamiento forestal o manejo sostenible */}
      <section className="form-section">
        <h2 className="section-heading">6. Información sobre el aprovechamiento forestal o manejo sostenible de la flora silvestre y los productos forestales no maderables</h2>
        <div className="mb-4">
          <label className="field">
            Método de aprovechamiento o manejo sostenible: <b>*</b>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="mecanico"
                checked={formData.metodoAprovechamiento === 'mecanico'}
                onChange={(e) => handleChange(e, 'metodoAprovechamiento')}
                onBlur={(e) => handleBlur(e, 'metodoAprovechamiento')}

              />
              Mecánico
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="manual"
                checked={formData.metodoAprovechamiento === 'manual'}
                onChange={(e) => handleChange(e, 'metodoAprovechamiento')}
                onBlur={(e) => handleBlur(e, 'metodoAprovechamiento')}

              />
              Manual
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="mecanicoManual"
                checked={formData.metodoAprovechamiento === 'mecanicoManual'}
                onChange={(e) => handleChange(e, 'metodoAprovechamiento')}
                onBlur={(e) => handleBlur(e, 'metodoAprovechamiento')}

              />
              Mecánico-Manual
            </label>
          </div>
          {errors.metodoAprovechamiento && (
            <p className="field-error">{errors.metodoAprovechamiento}</p>
          )}
        </div>

{/* Especies list */}
        <div className="species-section">
          <div className="species-header">
            <h3>Especies objeto de la solicitud:</h3>
          </div>
          <div className="species-list" role="list" aria-label="Lista de especies">
            {formData.especies.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay especies agregadas</p>
            ) : (
              formData.especies.map((esp, index) => (
                <article key={index} className="species-card" role="listitem">
                  <header className="species-card-header">
                    <span className="species-number">{String(index + 1).padStart(2, '0')}</span>
                    <h4 className="species-title">Especie {index + 1}</h4>
                    {formData.especies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEspecie(index)}
                        className="btn-link btn-remove"
                        aria-label={`Eliminar especie ${index + 1}`}
                      >
                        Eliminar
                      </button>
                    )}
                  </header>
                  <div className="species-fields">
                    <div className="field">
                      <label htmlFor={`especie-${index}-cantidad`}>Cantidad <b>*</b></label>
                      <input
                        id={`especie-${index}-cantidad`}
                        type="text"
                        value={esp.cantidad}
                        onChange={(e) => handleChange(e, 'especies', index, 'cantidad')}
                        placeholder="Ej. 100"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-unidadMedida`}>Unidad de medida <b>*</b></label>
                      <input
                        id={`especie-${index}-unidadMedida`}
                        type="text"
                        value={esp.unidadMedida}
                        onChange={(e) => handleChange(e, 'especies', index, 'unidadMedida')}
                        placeholder="Ej. m3, unidades, kg"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-nombreComun`}>Nombre común <b>*</b></label>
                      <input
                        id={`especie-${index}-nombreComun`}
                        type="text"
                        value={esp.nombreComun}
                        onChange={(e) => handleChange(e, 'especies', index, 'nombreComun')}
                        placeholder="Ej. Roble, Cedro, Pino"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-nombreCientifico`}>Nombre científico <b>*</b></label>
                      <input
                        id={`especie-${index}-nombreCientifico`}
                        type="text"
                        value={esp.nombreCientifico}
                        onChange={(e) => handleChange(e, 'especies', index, 'nombreCientifico')}
                        placeholder="Ej. Quercus humboldtii"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-habitos`}>Hábitat</label>
                      <input
                        id={`especie-${index}-habitos`}
                        type="text"
                        value={esp.habitos}
                        onChange={(e) => handleChange(e, 'especies', index, 'habitos')}
                        placeholder="Ej. Bosque húmedo, Bosque seco"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-parteAprovechada`}>Parte aprovechada</label>
                      <input
                        id={`especie-${index}-parteAprovechada`}
                        type="text"
                        value={esp.parteAprovechada}
                        onChange={(e) => handleChange(e, 'especies', index, 'parteAprovechada')}
                        placeholder="Ej. Tronco, Rama, Hoja"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-vedaNacionalRegional`}>Veda nacional/regional</label>
                      <input
                        id={`especie-${index}-vedaNacionalRegional`}
                        type="text"
                        value={esp.vedaNacionalRegional}
                        onChange={(e) => handleChange(e, 'especies', index, 'vedaNacionalRegional')}
                        placeholder="Ej. Resolución XXX/2023"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-categoriaAmenaza`}>Categoría de amenaza</label>
                      <input
                        id={`especie-${index}-categoriaAmenaza`}
                        type="text"
                        value={esp.categoriaAmenaza}
                        onChange={(e) => handleChange(e, 'especies', index, 'categoriaAmenaza')}
                        placeholder="Ej. VU, EN, CR, NT, LC"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`especie-${index}-usoProductos`}>Uso de los productos</label>
                      <input
                        id={`especie-${index}-usoProductos`}
                        type="text"
                        value={esp.usoProductos}
                        onChange={(e) => handleChange(e, 'especies', index, 'usoProductos')}
                        placeholder="Ej. Maderable, Energético, Artesanal"
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={addEspecie}
              className="btn-primary"
            >
              Agregar otra especie
            </button>
          </div>
          {errors.especies && <p className="field-error" style={{gridColumn: '1/-1', textAlign: 'center'}}>{errors.especies}</p>}
        </div>
      </section>

      {/* Sección 7: Información asociada a la solicitud de aprovechamiento de árboles aislados (si aplica) */}
      {formData.categoriaProducto === 'arbolesAislados' && (
        <section className="form-section">
          <h2 className="section-heading">7. Información asociada a la solicitud de aprovechamiento de árboles aislados (Si aplica)</h2>
          <div className="mb-4">
            <label className="field">
              Seleccione la ubicación o tipo de solicitud de los individuos objeto de aprovechamiento: <b>*</b>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="dentroCoberturaBosque"
                  checked={formData.arbolesAisladosUbicacion === 'dentroCoberturaBosque'}
                  onChange={(e) => handleChange(e, 'arbolesAisladosUbicacion')}
                  
                />
                Árboles aislados dentro de la cobertura del bosque natural
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="fueraCoberturaBosque"
                  checked={formData.arbolesAisladosUbicacion === 'fueraCoberturaBosque'}
                  onChange={(e) => handleChange(e, 'arbolesAisladosUbicacion')}
                  
                />
                Árboles aislados fuera de la cobertura del bosque natural
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="talaPodaEmergenciaUrbana"
                  checked={formData.arbolesAisladosUbicacion === 'talaPodaEmergenciaUrbana'}
                  onChange={(e) => handleChange(e, 'arbolesAisladosUbicacion')}
                  
                />
                Tala o poda de emergencia en centros urbanos
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="obraPublicaPrivadaUrbana"
                  checked={formData.arbolesAisladosUbicacion === 'obraPublicaPrivadaUrbana'}
                  onChange={(e) => handleChange(e, 'arbolesAisladosUbicacion')}
                  
                />
                Obra pública o privada en centros urbanos
              </label>
            </div>
            {errors.arbolesAisladosUbicacion && (
              <p className="field-error">{errors.arbolesAisladosUbicacion}</p>
            )}
          </div>

          {/* Subsecciones según ubicación */}
          {formData.arbolesAisladosUbicacion === 'dentroCoberturaBosque' || formData.arbolesAisladosUbicacion === 'fueraCoberturaBosque' && (
            <div >
              <label className="field">
                Estado del Individuo: <b>*</b>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="caidoCausasNaturales"
                    checked={formData.estadoIndividuo === 'caidoCausasNaturales'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Caído por causas naturales
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="muertoCausasNaturales"
                    checked={formData.estadoIndividuo === 'muertoCausasNaturales'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Muerto por causas naturales
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="razonesFitosanitarias"
                    checked={formData.estadoIndividuo === 'razonesFitosanitarias'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Razones de orden fitosanitario
                </label>
{ ((formData.arbolesAisladosUbicacion as 'dentroCoberturaBosque' | 'fueraCoberturaBosque' | 'talaPodaEmergenciaUrbana' | 'obraPublicaPrivadaUrbana' | '') === 'dentroCoberturaBosque' || (formData.arbolesAisladosUbicacion as 'dentroCoberturaBosque' | 'fueraCoberturaBosque' | 'talaPodaEmergenciaUrbana' | 'obraPublicaPrivadaUrbana' | '') === 'fueraCoberturaBosque') && (
                  <>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="caido"
                        checked={formData.estadoIndividuo === 'caido'}
                        onChange={(e) => handleChange(e, 'estadoIndividuo')}
                        onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                      />
                      Caído
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="muerto"
                        checked={formData.estadoIndividuo === 'muerto'}
                        onChange={(e) => handleChange(e, 'estadoIndividuo')}
                        onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                      />
                      Muerto
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="enfermo"
                        checked={formData.estadoIndividuo === 'enfermo'}
                        onChange={(e) => handleChange(e, 'estadoIndividuo')}
                        onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                      />
                      Enfermo
                    </label>
                  </>
                )}
              </div>
              {errors.estadoIndividuo && (
                <p className="field-error">{errors.estadoIndividuo}</p>
              )}
              {formData.estadoIndividuo === 'razonesFitosanitarias' && (
                <div >
                  <label className="field">
                    Especifique cuál: <b>*</b>
                  </label>
                  <input
                    type="text"
                    value={formData.razonesFitosanitariasEspecificar}
                    onChange={(e) => handleChange(e, 'razonesFitosanitariasEspecificar')}
                    onBlur={(e) => handleBlur(e, 'razonesFitosanitariasEspecificar')}
                    placeholder="Ej. Plaga de insectos"
                    aria-invalid={!!errors.razonesFitosanitariasEspecificar}
                    aria-describedby={errors.razonesFitosanitariasEspecificar ? `error-razonesFitosanitariasEspecificar` : undefined}
                  />
                  {errors.razonesFitosanitariasEspecificar && (
                    <p id="error-razonesFitosanitariasEspecificar" className="field-error">{errors.razonesFitosanitariasEspecificar}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {formData.arbolesAisladosUbicacion === 'talaPodaEmergenciaUrbana' && (
            <div >
              <label className="field">
                Estado del Individuo: <b>*</b>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="caido"
                    checked={formData.estadoIndividuo === 'caido'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Caído
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="muerto"
                    checked={formData.estadoIndividuo === 'muerto'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Muerto
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="enfermo"
                    checked={formData.estadoIndividuo === 'enfermo'}
                    onChange={(e) => handleChange(e, 'estadoIndividuo')}
                    onBlur={(e) => handleBlur(e, 'estadoIndividuo')}
                  />
                  Enfermo
                </label>
              </div>
              {errors.estadoIndividuo && (
                <p className="field-error">{errors.estadoIndividuo}</p>
              )}
              <label className="block text-sm font-medium mb-1 mt-2">
                Causa o Perjuicio: <b>*</b>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="estabilidadSuelos"
                    checked={formData.causaPerjuicio === 'estabilidadSuelos'}
                    onChange={(e) => handleChange(e, 'causaPerjuicio')}
                    onBlur={(e) => handleBlur(e, 'causaPerjuicio')}
                  />
                  Estabilidad de suelos
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="canalAgua"
                    checked={formData.causaPerjuicio === 'canalAgua'}
                    onChange={(e) => handleChange(e, 'causaPerjuicio')}
                    onBlur={(e) => handleBlur(e, 'causaPerjuicio')}
                  />
                  Canal de agua
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="obrasInfraestructuraEdificaciones"
                    checked={formData.causaPerjuicio === 'obrasInfraestructuraEdificaciones'}
                    onChange={(e) => handleChange(e, 'causaPerjuicio')}
                    onBlur={(e) => handleBlur(e, 'causaPerjuicio')}
                  />
                  Obras de infraestructura/edificaciones
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="otro"
                    checked={formData.causaPerjuicio === 'otro'}
                    onChange={(e) => handleChange(e, 'causaPerjuicio')}
                    onBlur={(e) => handleBlur(e, 'causaPerjuicio')}
                  />
                  Otro
                </label>
              </div>
              {errors.causaPerjuicio && (
                <p className="field-error">{errors.causaPerjuicio}</p>
              )}
              {formData.causaPerjuicio === 'otro' && (
                <div >
                  <label className="field">
                    Especifique cuál: <b>*</b>
                  </label>
                  <input
                    type="text"
                    value={formData.causaPerjuicioOtro}
                    onChange={(e) => handleChange(e, 'causaPerjuicioOtro')}
                    onBlur={(e) => handleBlur(e, 'causaPerjuicioOtro')}
                    placeholder="Ej. Contaminación"
                    aria-invalid={!!errors.causaPerjuicioOtro}
                    aria-describedby={errors.causaPerjuicioOtro ? `error-causaPerjuicioOtro` : undefined}
                  />
                  {errors.causaPerjuicioOtro && (
                    <p id="error-causaPerjuicioOtro" className="field-error">{errors.causaPerjuicioOtro}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {formData.arbolesAisladosUbicacion === 'obraPublicaPrivadaUrbana' && (
            <div >
              <label className="field">
                Actividad dentro de obras de infraestructura: <b>*</b>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="construccionRealizacion"
                    checked={formData.actividadInfraestructura === 'construccionRealizacion'}
                    onChange={(e) => handleChange(e, 'actividadInfraestructura')}
                    onBlur={(e) => handleBlur(e, 'actividadInfraestructura')}
                  />
                  Construcción / Realización
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="remodelacion"
                    checked={formData.actividadInfraestructura === 'remodelacion'}
                    onChange={(e) => handleChange(e, 'actividadInfraestructura')}
                    onBlur={(e) => handleBlur(e, 'actividadInfraestructura')}
                  />
                  Remodelación
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="ampliacion"
                    checked={formData.actividadInfraestructura === 'ampliacion'}
                    onChange={(e) => handleChange(e, 'actividadInfraestructura')}
                    onBlur={(e) => handleBlur(e, 'actividadInfraestructura')}
                  />
                  Ampliación
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="instalacion"
                    checked={formData.actividadInfraestructura === 'instalacion'}
                    onChange={(e) => handleChange(e, 'actividadInfraestructura')}
                    onBlur={(e) => handleBlur(e, 'actividadInfraestructura')}
                  />
                  Instalación
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="similares"
                    checked={formData.actividadInfraestructura === 'similares'}
                    onChange={(e) => handleChange(e, 'actividadInfraestructura')}
                    onBlur={(e) => handleBlur(e, 'actividadInfraestructura')}
                  />
                  Similares
                </label>
              </div>
              {errors.actividadInfraestructura && (
                <p className="field-error">{errors.actividadInfraestructura}</p>
              )}
              {formData.actividadInfraestructura === 'similares' && (
                <div >
                  <label className="field">
                    Especifique cuál: <b>*</b>
                  </label>
                  <input
                    type="text"
                    value={formData.similaresEspecificar}
                    onChange={(e) => handleChange(e, 'similaresEspecificar')}
                    onBlur={(e) => handleBlur(e, 'similaresEspecificar')}
                    placeholder="Ej. Mantenimiento de vías"
                    aria-invalid={!!errors.similaresEspecificar}
                    aria-describedby={errors.similaresEspecificar ? `error-similaresEspecificar` : undefined}
                  />
                  {errors.similaresEspecificar && (
                    <p id="error-similaresEspecificar" className="field-error">{errors.similaresEspecificar}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Sección 8: Notificación */}
      <section className="form-section">
        <h2 className="section-heading">8. Notificación</h2>
        <div className="mb-4">
          <label className="field">
            ¿Autoriza la notificación electrónica? <b>*</b>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="si"
                checked={formData.notificacionElectronica === 'si'}
                onChange={(e) => handleChange(e, 'notificacionElectronica')}
                onBlur={(e) => handleBlur(e, 'notificacionElectronica')}

              />
              Sí
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="no"
                checked={formData.notificacionElectronica === 'no'}
                onChange={(e) => handleChange(e, 'notificacionElectronica')}
                onBlur={(e) => handleBlur(e, 'notificacionElectronica')}

              />
              No
            </label>
          </div>
          {errors.notificacionElectronica && (
            <p className="field-error">{errors.notificacionElectronica}</p>
          )}
        </div>

        {formData.notificacionElectronica === 'si' && (
          <div >
            <label className="field">
              Correo electrónico: <b>*</b>
            </label>
            <input
              type="text"
              value={formData.correoElectronico}
              onChange={(e) => handleChange(e, 'correoElectronico')}
              onBlur={(e) => handleBlur(e, 'correoElectronico')}
              placeholder="ejemplo@dominio.com"

            />
            {errors.correoElectronico && (
              <p id="error-correoElectronico" className="field-error">{errors.correoElectronico}</p>
            )}
            <label className="block text-sm font-medium mb-1 mt-2">
              Teléfono(s): <b>*</b>
            </label>
            <input
              type="text"
              value={formData.telefonos}
              onChange={(e) => handleChange(e, 'telefonos')}
              onBlur={(e) => handleBlur(e, 'telefonos')}
              placeholder="+57 300 123 4567"

            />
            {errors.telefonos && (
              <p id="error-telefonos" className="field-error">{errors.telefonos}</p>
            )}
          </div>
        )}

        {formData.notificacionElectronica === 'no' && (
          <div >
            <label className="field">
              Dirección de notificación: <b>*</b>
            </label>
            <input
              type="text"
              value={formData.direccionNotificacion}
              onChange={(e) => handleChange(e, 'direccionNotificacion')}
              onBlur={(e) => handleBlur(e, 'direccionNotificacion')}
              placeholder="Ej. Calle 123 # 45-67"

            />
            {errors.direccionNotificacion && (
              <p id="error-direccionNotificacion" className="field-error">{errors.direccionNotificacion}</p>
            )}
            <div className="section-fields">
              <div>
                <label className="field">
                  Municipio: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.municipioNotificacion}
                  onChange={(e) => handleChange(e, 'municipioNotificacion')}
                  onBlur={(e) => handleBlur(e, 'municipioNotificacion')}
                  placeholder="Ej. Medellín"

                />
                {errors.municipioNotificacion && (
                  <p id="error-municipioNotificacion" className="field-error">{errors.municipioNotificacion}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Nombre centro poblado, vereda o corregimiento: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.nombreCentroPobladoVeredaCorregimiento}
                  onChange={(e) => handleChange(e, 'nombreCentroPobladoVeredaCorregimiento')}
                  onBlur={(e) => handleBlur(e, 'nombreCentroPobladoVeredaCorregimiento')}
                  placeholder="Ej. San Cristóbal"

                />
                {errors.nombreCentroPobladoVeredaCorregimiento && (
                  <p id="error-nombreCentroPobladoVeredaCorregimiento" className="field-error">{errors.nombreCentroPobladoVeredaCorregimiento}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Departamento: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.departamentoNotificacion}
                  onChange={(e) => handleChange(e, 'departamentoNotificacion')}
                  onBlur={(e) => handleBlur(e, 'departamentoNotificacion')}
                  placeholder="Ej. Antioquia"

                />
                {errors.departamentoNotificacion && (
                  <p id="error-departamentoNotificacion" className="field-error">{errors.departamentoNotificacion}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {formData.notificacionElectronica === 'no' && (
          <div >
            <label className="field">
              Dirección de notificación: <b>*</b>
            </label>
            <input
              type="text"
              value={formData.direccionNotificacion}
              onChange={(e) => handleChange(e, 'direccionNotificacion')}
              onBlur={(e) => handleBlur(e, 'direccionNotificacion')}
              placeholder="Ej. Calle 123 # 45-67"

              aria-invalid={!!errors.direccionNotificacion}
              aria-describedby={errors.direccionNotificacion ? `error-direccionNotificacion` : undefined}
            />
            {errors.direccionNotificacion && (
              <p id="error-direccionNotificacion" className="field-error">{errors.direccionNotificacion}</p>
            )}
            <div className="section-fields">
              <div>
                <label className="field">
                  Municipio: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.municipioNotificacion}
                  onChange={(e) => handleChange(e, 'municipioNotificacion')}
                  onBlur={(e) => handleBlur(e, 'municipioNotificacion')}
                  placeholder="Ej. Medellín"

                  aria-invalid={!!errors.municipioNotificacion}
                  aria-describedby={errors.municipioNotificacion ? `error-municipioNotificacion` : undefined}
                />
                {errors.municipioNotificacion && (
                  <p id="error-municipioNotificacion" className="field-error">{errors.municipioNotificacion}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Nombre centro poblado, vereda o corregimiento: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.nombreCentroPobladoVeredaCorregimiento}
                  onChange={(e) => handleChange(e, 'nombreCentroPobladoVeredaCorregimiento')}
                  onBlur={(e) => handleBlur(e, 'nombreCentroPobladoVeredaCorregimiento')}
                  placeholder="Ej. San Cristóbal"

                  aria-invalid={!!errors.nombreCentroPobladoVeredaCorregimiento}
                  aria-describedby={errors.nombreCentroPobladoVeredaCorregimiento ? `error-nombreCentroPobladoVeredaCorregimiento` : undefined}
                />
                {errors.nombreCentroPobladoVeredaCorregimiento && (
                  <p id="error-nombreCentroPobladoVeredaCorregimiento" className="field-error">{errors.nombreCentroPobladoVeredaCorregimiento}</p>
                )}
              </div>
              <div>
                <label className="field">
                  Departamento: <b>*</b>
                </label>
                <input
                  type="text"
                  value={formData.departamentoNotificacion}
                  onChange={(e) => handleChange(e, 'departamentoNotificacion')}
                  onBlur={(e) => handleBlur(e, 'departamentoNotificacion')}
                  placeholder="Ej. Antioquia"

                  aria-invalid={!!errors.departamentoNotificacion}
                  aria-describedby={errors.departamentoNotificacion ? `error-departamentoNotificacion` : undefined}
                />
                {errors.departamentoNotificacion && (
                  <p id="error-departamentoNotificacion" className="field-error">{errors.departamentoNotificacion}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Sección 9: Firma del interesado */}
      <section className="form-section">
        <h2 className="section-heading">9. Firma del interesado</h2>
        <div className="mb-4">
          <label className="field">
            Nombre: <b>*</b>
          </label>
          <input
            type="text"
            value={formData.nombreFirmante}
            onChange={(e) => handleChange(e, 'nombreFirmante')}
            onBlur={(e) => handleBlur(e, 'nombreFirmante')}
            placeholder="Juan Pérez Gómez"

            aria-invalid={!!errors.nombreFirmante}
            aria-describedby={errors.nombreFirmante ? `error-nombreFirmante` : undefined}
          />
          {errors.nombreFirmante && (
            <p id="error-nombreFirmante" className="field-error">{errors.nombreFirmante}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Nota: La firma física o digital se requiere según las instrucciones de la autoridad ambiental competente.
        </p>
      </section>

      {/* Botón de descarga */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          style={{ flex: 1, maxWidth: '340px' }}
          disabled={downloading}
        >
          {downloading ? 'Generando PDF…' : 'Descargar PDF diligenciado'}
        </button>
      </div>

      {/* Mensajes de resultado */}
      {submitSuccess && (
        <div className="alert alert-success">
          PDF generado correctamente con la plantilla oficial.
        </div>
      )}
      {submitError && (
        <div className="alert alert-error">
          Error: {submitError}
        </div>
      )}
    </form>
  );
};

export default FormularioFUN;

