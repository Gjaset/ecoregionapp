import React from 'react';

interface FormularioSDAProps {
  formData?: any;
  details?: any;
  onSectionChange?: any;
  onSpeciesChange?: any;
  onAddSpecies?: any;
  onRemoveSpecies?: any;
  onDetailChange?: any;
}

const FormularioSDA: React.FC<FormularioSDAProps> = () => {
  return (
    <div className="formulario-sda">
      <header className="form-header">
        <h1>Formulario SDA - Secretaría Distrital de Ambiente</h1>
        <p>Próximamente</p>
      </header>
      <div className="form-placeholder">
        <p>Este formulario está en desarrollo.</p>
      </div>
    </div>
  );
};

export default FormularioSDA;