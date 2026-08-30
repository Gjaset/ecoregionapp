import React from 'react';

interface FormularioCORProps {
  formData?: any;
  details?: any;
  onSectionChange?: any;
  onSpeciesChange?: any;
  onAddSpecies?: any;
  onRemoveSpecies?: any;
  onDetailChange?: any;
}

const FormularioCOR: React.FC<FormularioCORProps> = () => {
  return (
    <div className="formulario-cor">
      <header className="form-header">
        <h1>Formulario Corpoboyacá</h1>
        <p>Próximamente</p>
      </header>
      <div className="form-placeholder">
        <p>Este formulario está en desarrollo.</p>
      </div>
    </div>
  );
};

export default FormularioCOR;