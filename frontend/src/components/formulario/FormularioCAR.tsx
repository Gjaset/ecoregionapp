import React from 'react';

interface FormularioCARProps {
  formData?: any;
  details?: any;
  onSectionChange?: any;
  onSpeciesChange?: any;
  onAddSpecies?: any;
  onRemoveSpecies?: any;
  onDetailChange?: any;
}

const FormularioCAR: React.FC<FormularioCARProps> = () => {
  return (
    <div className="formulario-car">
      <header className="form-header">
        <h1>Formulario CAR Cundinamarca</h1>
        <p>Próximamente</p>
      </header>
      <div className="form-placeholder">
        <p>Este formulario está en desarrollo.</p>
      </div>
    </div>
  );
};

export default FormularioCAR;