import type { ScenarioId } from "@/lib/types/datacenter";

export const scenarios: Record<ScenarioId, { label: string; description: string }> = {
  normal: { label: "Operacion normal", description: "Condiciones estables con cumplimiento alto." },
  efficient: { label: "Alta eficiencia", description: "PUE optimizado y climatizacion estable." },
  cooling_failure: { label: "Falla climatizacion", description: "HVAC degradado y temperatura en aumento." },
  ups_overload: { label: "Sobrecarga UPS", description: "Carga electrica sobre umbral operativo." },
  unauthorized_access: { label: "Acceso no autorizado", description: "Evento critico en zona restringida." },
  fire_risk: { label: "Riesgo incendio", description: "Sensor de humo y supresion en alerta." },
  high_pue: { label: "PUE alto", description: "Eficiencia energetica deteriorada." },
  recovery: { label: "Recuperacion", description: "Mitigacion posterior a incidente." },
};

export const scenarioIds = Object.keys(scenarios) as ScenarioId[];
