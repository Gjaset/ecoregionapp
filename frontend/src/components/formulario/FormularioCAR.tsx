import type { ChangeEvent, ComponentProps } from 'react';
import { ApplicationForm } from './ApplicationForm';
import { CARFields } from './AuthorityFields';
import type { FormData } from '../../types/formulario';

type SharedFormProps = ComponentProps<typeof ApplicationForm>;

export interface CARFormProps {
  formData: FormData;
  details: Record<string, string | boolean>;
  onSectionChange: SharedFormProps['onSectionChange'];
  onSpeciesChange: SharedFormProps['onSpeciesChange'];
  onAddSpecies: () => void;
  onRemoveSpecies: (index: number) => void;
  onDetailChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function FormularioCAR({ formData, details, onSectionChange, onSpeciesChange, onAddSpecies, onRemoveSpecies, onDetailChange }: CARFormProps) {
  return <ApplicationForm formData={formData} onSectionChange={onSectionChange} onSpeciesChange={onSpeciesChange} onAddSpecies={onAddSpecies} onRemoveSpecies={onRemoveSpecies}><CARFields details={details} onChange={onDetailChange} /></ApplicationForm>;
}