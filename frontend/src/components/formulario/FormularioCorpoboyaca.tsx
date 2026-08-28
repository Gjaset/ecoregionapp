import type { ChangeEvent, ComponentProps } from 'react';
import { ApplicationForm } from './ApplicationForm';
import { CorpoboyacaFields } from './AuthorityFields';
import type { FormData } from '../../types/formulario';

type SharedFormProps = ComponentProps<typeof ApplicationForm>;

export interface CorpoboyacaFormProps {
  formData: FormData;
  details: Record<string, string | boolean>;
  onSectionChange: SharedFormProps['onSectionChange'];
  onSpeciesChange: SharedFormProps['onSpeciesChange'];
  onAddSpecies: () => void;
  onRemoveSpecies: (index: number) => void;
  onDetailChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function FormularioCorpoboyaca({ formData, details, onSectionChange, onSpeciesChange, onAddSpecies, onRemoveSpecies, onDetailChange }: CorpoboyacaFormProps) {
  return <ApplicationForm formData={formData} onSectionChange={onSectionChange} onSpeciesChange={onSpeciesChange} onAddSpecies={onAddSpecies} onRemoveSpecies={onRemoveSpecies}><CorpoboyacaFields details={details} onChange={onDetailChange} /></ApplicationForm>;
}