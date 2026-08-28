import type { ChangeEvent, ComponentProps } from 'react';
import { ApplicationForm } from './ApplicationForm';
import { SDAFields } from './AuthorityFields';
import type { FormData } from '../../types/formulario';

export interface AuthorityFormProps {
  formData: FormData;
  details: Record<string, string | boolean>;
  onSectionChange: ApplicationFormProps['onSectionChange'];
  onSpeciesChange: ApplicationFormProps['onSpeciesChange'];
  onAddSpecies: () => void;
  onRemoveSpecies: (index: number) => void;
  onDetailChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

type ApplicationFormProps = ComponentProps<typeof ApplicationForm>;

export function FormularioSDA({ formData, details, onSectionChange, onSpeciesChange, onAddSpecies, onRemoveSpecies, onDetailChange }: AuthorityFormProps) {
  return <ApplicationForm formData={formData} onSectionChange={onSectionChange} onSpeciesChange={onSpeciesChange} onAddSpecies={onAddSpecies} onRemoveSpecies={onRemoveSpecies}><SDAFields details={details} onChange={onDetailChange} /></ApplicationForm>;
}
