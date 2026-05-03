import { isoDomains } from "@/lib/iso/iso-domains";
import type {
  ComplianceControl,
  ComplianceDomain,
  ComplianceSummary,
  DataCenterZone,
  IsoDomainId,
} from "@/lib/types/datacenter";
import { complianceStatusFromScore, statusFromScore } from "@/lib/utils/status";

const domainIds = Object.keys(isoDomains) as IsoDomainId[];

function metricNumber(zone: DataCenterZone, key: string): number | undefined {
  const metric = zone.metrics.find((item) => item.key === key);
  return typeof metric?.value === "number" ? metric.value : undefined;
}

function zoneById(zones: DataCenterZone[], id: string): DataCenterZone | undefined {
  return zones.find((zone) => zone.id === id);
}

export function evaluateCompliance(zones: DataCenterZone[], pue: number): ComplianceSummary {
  const penalties = new Map<IsoDomainId, string[]>();

  for (const id of domainIds) penalties.set(id, []);

  const dataHall = zoneById(zones, "data-hall");
  const hvac = zoneById(zones, "hvac-room");
  const ups = zoneById(zones, "ups-room");
  const access = zoneById(zones, "access-control");
  const fire = zoneById(zones, "fire-system");
  const telecom = zoneById(zones, "telecom-room");

  const dataTemp = dataHall ? metricNumber(dataHall, "temperature") : undefined;
  const humidity = dataHall ? metricNumber(dataHall, "humidity") : undefined;
  const upsLoad = ups ? metricNumber(ups, "upsLoad") : undefined;
  const upsRuntime = ups ? metricNumber(ups, "runtime") : undefined;
  const accessEvents = access ? metricNumber(access, "unauthorizedEvents") : undefined;
  const smoke = fire ? metricNumber(fire, "smoke") : undefined;
  const cableCapacity = telecom ? metricNumber(telecom, "patchCapacity") : undefined;
  const hvacCapacity = hvac ? metricNumber(hvac, "capacity") : undefined;

  if (typeof dataTemp === "number" && dataTemp > 27) penalties.get("22237-4")?.push("Temperatura del Data Hall fuera del umbral recomendado.");
  if (typeof humidity === "number" && (humidity < 40 || humidity > 60)) penalties.get("22237-4")?.push("Humedad relativa fuera de rango operativo.");
  if (typeof hvacCapacity === "number" && hvacCapacity > 90) penalties.get("22237-4")?.push("Capacidad HVAC cercana al limite.");
  if (typeof upsLoad === "number" && upsLoad > 85) penalties.get("22237-3")?.push("Carga UPS superior al umbral de operacion segura.");
  if (typeof upsRuntime === "number" && upsRuntime < 15) penalties.get("22237-3")?.push("Autonomia UPS insuficiente para continuidad.");
  if (typeof accessEvents === "number" && accessEvents > 0) penalties.get("22237-6")?.push("Evento de acceso no autorizado en zona restringida.");
  if (typeof smoke === "number" && smoke > 0) {
    penalties.get("22237-2")?.push("Riesgo fisico detectado por sensor de humo.");
    penalties.get("22237-6")?.push("Sistema de proteccion fisica en condicion critica.");
    penalties.get("22237-7")?.push("Incidente operativo requiere procedimiento documentado.");
  }
  if (typeof cableCapacity === "number" && cableCapacity > 88) penalties.get("22237-5")?.push("Ocupacion de patch panels cercana al limite.");
  if (pue > 1.8) penalties.get("22237-8")?.push("PUE elevado indica baja eficiencia energetica.");

  const domains: ComplianceDomain[] = domainIds.map((id) => {
    const risks = penalties.get(id) ?? [];
    const score = Math.max(45, 96 - risks.length * 18);
    return {
      id,
      title: isoDomains[id].title,
      description: isoDomains[id].description,
      score,
      status: statusFromScore(score),
      controlsTotal: 6,
      controlsCompliant: Math.round((score / 100) * 6),
      risks,
    };
  });

  const controls: ComplianceControl[] = domains.map((domain) => ({
    id: `${domain.id}-control`,
    isoDomain: domain.id,
    title: `Control operativo ${domain.title}`,
    description: domain.description,
    status: complianceStatusFromScore(domain.score),
    evidence: domain.risks.length === 0 ? "Sensores simulados dentro de parametros." : "Evidencia simulada requiere revision del operador.",
    risk: domain.risks[0] ?? "Riesgo bajo con monitoreo continuo.",
  }));

  const globalScore = Math.round(domains.reduce((sum, domain) => sum + domain.score, 0) / domains.length);

  return { globalScore, domains, controls };
}
