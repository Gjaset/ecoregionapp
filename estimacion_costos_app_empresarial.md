# Estimación de costos — Aplicación web empresarial de alta complejidad

> **Alcance supuesto:** plataforma web con base de datos compleja, seguridad avanzada,
> ciclo de desarrollo de 12+ meses y despliegue a producción con alta disponibilidad.
> **TRM de referencia: $3.126,08 COP por USD** (8-sep-2026, Banco de la República /
> Superfinanciera). Cifras en COP redondeadas.
> **Fecha del análisis:** 9 de septiembre de 2026.

---

## 1. Resumen ejecutivo

| Escenario (desarrollo hasta producción, 13 meses incl. discovery) | USD | COP |
|---|---|---|
| **In-house** (equipo interno Colombia) | **$0,94 M** | **$2.940 M** |
| **Híbrido** (núcleo interno + squad externo) | **$1,21 M** | **$3.790 M** |
| **Outsourcing** (agencia LatAm bilingüe) | **$1,37 M** | **$4.283 M** |
| Mantenimiento y soporte, año 1 | **$0,33 – 0,45 M** | **$1.030 – 1.410 M** |
| Cumplimiento opcional (GDPR y/o SOC 2) | **+$0,05 – 0,22 M** | **+$160 – 690 M** |

> **TCO 3 años ≈ 1,5–2x el costo de construcción** (coherente con benchmarks de la
> industria). El rango mínimo asume 0 integraciones legacy y sin certificaciones;
> el máximo incluye integraciones complejas y cumplimiento normativo.

---

## 2. Fundamento de mercado (fuentes verificables)

| Dato | Rango | Fuente (fecha) |
|---|---|---|
| App empresarial grande, EE. UU. | $250K – $1M+, 10–18 meses | Cubix, ago-2026 — https://www.cubix.co/blog/enterprise-web-development-cost/ |
| Plataforma core / tier cumplimiento | $150–500K / $300K–$1M+, 40–78 sem. | RaftLabs, feb-2026 — https://www.raftlabs.com/blog/enterprise-software-development-cost |
| Plataforma empresarial full (Europa) | €120–350K; mantenimiento 15–20%/año | Zulbera, abr-2026 — https://www.zulbera.com/insights/enterprise-software-development-cost/ |
| Agencia EE. UU. | $100–250/h; compliance +15–25% del budget | Chop Dawg, jul-2026 — https://www.chopdawg.com/enterprise-app-development-cost-in-the-united-states-in-2026/ |
| Senior Colombia in-country | $35–75/h; bilingüe $45–90/h | TechVendorIndex, ene-2026 — https://techvendorindex.com/regions/colombia/custom-software-development/ |
| Senior Colombia por agencia | $50–70/h (trio.dev) / $60+/h (Kore BPO) | trio.dev abr-2026 (https://trio.dev/nearshore-software-development-rates/); korebpo.com ago-2026 |
| Salario senior Colombia | $8–15M COP/mes; carga prestacional +45% | Michael Page vía trabajaconmigo.info, abr-2026; salariostech.co (mediana senior $14M) |
| Infra AWS prod. alta disponibilidad | $5–20K/mes | Eon.io, jul-2026 — https://www.eon.io/blog/aws-cloud-hosting-cost |
| Infra enterprise (staging+prod+DR) | $3–15K/mes | RaftLabs, feb-2026 |
| Mantenimiento anual | 15–25% del costo de desarrollo | Abbacus feb-2026; RaftLabs; tecwebpro jul-2026 |
| SOC 2 Tipo II año 1 (20–50 personas) | $35–80K all-in; renovación $15–60K | vCISO Lite jun-2026; Radius360 abr-2026; episki feb-2026 |
| ISO 27001 año 1 | $60–150K (pequeña); vigilancia anual $10–30K | episki feb-2026; Statvix abr-2026 |
| GDPR (build / anual) | $20–50K / $5–15K | RaftLabs feb-2026 |

*Precios de nube y auditoría son públicos y verificables; salarios y tarifas son
promedios de mercado 2026 (estimación fundamentada, no cotización).*

---

## 3. Estimación 1 — Desarrollo total hasta producción

Equipo de referencia (10 personas, 13 meses con discovery):

| Rol | In-house (COP/mes +45% carga) | Outsourcing (USD/h agencia LatAm) |
|---|---|---|
| Arquitecto / Tech lead | $16M → $23,2M | $90 |
| 5× Dev senior | $12M c/u → $87M | $60 |
| Diseñador UX/UI senior | $10M → $14,5M | $55 |
| QA | $7M → $10,2M | $40 |
| DevOps | $12M → $17,4M | $65 |
| PM | $11M → $16M | incluido |
| **Costo mensual cargado** | **≈ $168M ($53,8K)** | **≈ $88K** |

| Concepto (13 meses) | In-house | Híbrido | Outsourcing |
|---|---|---|---|
| Mano de obra | $699K / $2.185M | Núcleo int. $350K + squad ext. $624K | $1.144K |
| Discovery y arquitectura | (interno) | $15K / $47M | $20K / $63M |
| Licencias y herramientas | $39K / $122M | $30K / $94M | $20K / $63M |
| Infra dev/staging | $39K / $122M | $39K / $122M | $39K / $122M |
| Reclutamiento (fees 15–25%) | $40K / $125M | $15K / $47M | $0 |
| Subtotal | $817K | $1.073K | $1.223K |
| Contingencia (15% / 13% / 12%) | $123K | $139K | $147K |
| **TOTAL desarrollo** | **$940K / $2.940M** | **$1.212K / $3.790M** | **$1.370K / $4.283M** |

Detalle por fase (referencia, cualquier modelo): descubrimiento 5–8%, UX/UI 10–12%,
frontend 20–25%, backend e integraciones 30–40%, QA/testing 10–20%,
DevOps/seguridad/despliegue 8–12% (Cubix ago-2026; Zulbera abr-2026).

### Comparativa de modelos de ejecución

|  | In-house | Outsourcing | Híbrido (recomendado) |
|---|---|---|---|
| Costo total | $940K | $1.370K | $1.212K |
| Tiempo | 13–15 meses (reclutamiento suma 2–3) | 12–13 meses | 12–14 meses |
| Ventajas | Conocimiento retenido, control total, menor costo a 3 años | Inicio inmediato, riesgo transferido, escala flexible | Balance costo/velocidad; núcleo crítico interno |
| Desventajas | Reclutamiento lento, rotación (~12–15%/año salarios senior CO), capacidad ociosa post-launch | Más caro, dependencia del proveedor, transferencia de conocimiento débil | Requiere gestión de dos equipos y contratos claros |

---

## 4. Estimación 2 — Mantenimiento y soporte, año 1

| Concepto/año | In-house | Híbrido / Outsourcing |
|---|---|---|
| Ingeniería (retainer ~18% del build) | $170K / $531M | $220–250K / $688–782M |
| Infraestructura nube prod (ver §5) | $84K / $263M | $84K / $263M |
| Licencias, monitoreo, soporte tools | $36K / $113M | $36K / $113M |
| Soporte funcional / mesa de ayuda | (equipo interno parcial) | $30K / $94M |
| **TOTAL año 1** | **$290K / $907M** | **$370–400K / $1.157–1.250M** |

Rango consolidado para junta: **$330–450K (COP $1.030–1.410M)**.

---

## 5. Infraestructura

### Opción A — Nube (AWS us-east-1, precios públicos on-demand 2026)

| Componente | Bajo | Medio | Alto |
|---|---|---|---|
| Cómputo (ECS/EKS, multi-AZ) | $800 | $2.500 | $6.000 |
| Base de datos (RDS Multi-AZ + réplica) | $400 | $1.200 | $3.000 |
| Redis, ALB, CloudFront, S3, NAT, WAF, logs | $500 | $1.500 | $4.000 |
| Soporte Business (10%) + monitoreo | $300 | $800 | $2.000 |
| **Total mensual** | **$2.000** | **$6.000** | **$15.000** |
| **Total anual** | **$24K / $75M** | **$72K / $225M** | **$180K / $563M** |

Fuentes: Eon.io jul-2026; ProjectHelena may-2026 (EKS $73 + nodos; NAT $0.045/h);
Spendark jul-2026. Nota: São Paulo cuesta ~2x EE. UU.; con Savings Plans a 1 año
se ahorra 30–40%.

### Opción B — On-premise

| Concepto | Rango USD | COP |
|---|---|---|
| Hardware (servidores HA, storage, red, firewall) CAPEX | $80–150K | $250–469M |
| Licencias (virtualización, SO, respaldos) | $15–40K | $47–125M |
| Adecuación física, energía, seguridad (año 1) | $15–30K | $47–94M |
| Personal TI dedicado (admin + DBA parcial) | $50–80K/año | $156–250M/año |
| **Año 1 total** | **$160–300K** | **$500–938M** |

*Estimación basada en estándares de mercado (no hay precio único verificable;
pedir cotización a HPE/Dell/Lenovo). La nube gana en elasticidad y CAPEX cero;
on-premise solo se justifica por residencia de datos o inversión ya amortizada.*

---

## 6. Licencias y herramientas (incluidas arriba, desglose anual)

GitHub Enterprise ~$250/u/año, Jira ~$100/u/año, Figma ~$150/u/año,
DataDog/Sentry $5–15K, Auth0/Okta $5–20K, Snyk $5–15K, Google Workspace $72/u/año,
CI/CD $3–8K. **Total equipo de 12: ~$30–45K/año ($94–141M)** (precios públicos de
cada proveedor, 2026).

---

## 7. Escenario de riesgo y cumplimiento normativo

| Requisito | ¿Obligatorio? | Costo build | Costo anual | Fuente |
|---|---|---|---|---|
| **Ley 1581 habeas data (CO)** + registro SIC | **Sí, si hay datos personales en CO** | $5–15K *(estimado)* | $2–5K *(estimado)* | Ley 1581/2012; TechVendorIndex (menciona Ley 1581 + Circular SFC 029) |
| **SFC Circular 029 (solo sector financiero)** | **Sí, si es vigilada** | $30–80K *(estimado, auditoría local)* | $10–25K *(estimado)* | — |
| **GDPR** | Solo si hay usuarios en UE/EEE | $20–50K | $5–15K | RaftLabs feb-2026 |
| **SOC 2 Tipo II** | Solo si clientes empresa lo exigen (típico B2B EE. UU.) | $50–130K | $15–60K | vCISO/Radius360/episki 2026 |
| **ISO 27001** | Solo si lo exigen clientes internacionales/licitaciones | $60–150K | $10–30K vigilancia | episki feb-2026; Statvix abr-2026 |
| Pentest anual | Recomendado siempre | — | $5–15K | Radius360 abr-2026 |

Impacto: sin certificaciones el presupuesto no cambia; con **GDPR + SOC 2 sumar
$70–180K ($220–563M)** al año 1. Iniciar cumplimiento 6 meses antes del launch
(no 6 semanas): es la causa #1 de retrasos según RaftLabs.

---

## 8. Riesgos presupuestales clave

1. **Integraciones legacy** (SOAP, sin sandbox): +$15–40K c/u; con 5+ sistemas
   sumar $80–150K (Chop Dawg; RaftLabs).
2. **Migración de datos**: +$50–200K y 6–12 semanas (RaftLabs) — presupuestar
   15–25% extra en migraciones (tecwebpro).
3. **Rotación salarial CO**: salarios senior crecen 12–15%/año (TechVendorIndex)
   — indexar retainer in-house.
4. **Contingencia aplicada**: 12–15% ya incluida; no recortarla.

---

### Fuentes principales

Cubix (ago-2026), RaftLabs (feb-2026), Zulbera (abr-2026), Chop Dawg (jul-2026),
tecwebpro (jul-2026), abbacustechnologies (feb-2026), projectcostestimator
(jun-2026), TechVendorIndex (ene-2026), Kore BPO / ParallelStaff / trio.dev /
Curotec (2026), Michael Page vía trabajaconmigo.info (abr-2026),
salariostech.co, Eon.io / ProjectHelena / Spendark (2026), Radius360 / episki /
vCISO Lite / Statvix / Beancount (2026), TRM Banco de la República vía
dolar-colombia.com (8-sep-2026).
