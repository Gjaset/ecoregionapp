import { Building2, Check } from 'lucide-react';

export type AuthorityCode = 'SDA' | 'CAR' | 'CORPOBOYACA';

const authorities: Array<{ code: AuthorityCode; name: string; detail: string }> = [
  { code: 'SDA', name: 'Secretaría Distrital de Ambiente', detail: 'Bogotá D.C.' },
  { code: 'CAR', name: 'CAR Cundinamarca', detail: 'Municipios de Cundinamarca' },
  { code: 'CORPOBOYACA', name: 'Corpoboyacá', detail: 'Municipios de Boyacá' },
];

interface AuthoritySelectorProps {
  value: AuthorityCode;
  onChange: (authority: AuthorityCode) => void;
}

export function AuthoritySelector({ value, onChange }: AuthoritySelectorProps) {
  return (
    <section className="authority-selector" aria-labelledby="authority-title">
      <div className="selector-heading"><span className="eyebrow"><Building2 size={14} /> Autoridad ambiental</span><h2 id="authority-title">¿Dónde vas a radicar?</h2><p>Elige la autoridad para mostrar los campos y soportes que corresponden a tu trámite.</p></div>
      <div className="authority-options">
        {authorities.map((authority) => <button type="button" className={`authority-option ${value === authority.code ? 'is-selected' : ''}`} onClick={() => onChange(authority.code)} key={authority.code}><span className="authority-check">{value === authority.code && <Check size={14} />}</span><span><strong>{authority.name}</strong><small>{authority.detail}</small></span></button>)}
      </div>
    </section>
  );
}
