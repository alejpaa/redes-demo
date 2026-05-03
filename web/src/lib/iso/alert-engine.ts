import type { Alert, ComplianceSummary, DataCenterZone } from "@/lib/types/datacenter";

function metricNumber(zone: DataCenterZone, key: string): number | undefined {
  const metric = zone.metrics.find((item) => item.key === key);
  return typeof metric?.value === "number" ? metric.value : undefined;
}

export function generateAlerts(zones: DataCenterZone[], compliance: ComplianceSummary, timestamp: string): Alert[] {
  const alerts: Alert[] = [];

  for (const zone of zones) {
    const temperature = metricNumber(zone, "temperature");
    const upsLoad = metricNumber(zone, "upsLoad");
    const unauthorizedEvents = metricNumber(zone, "unauthorizedEvents");
    const smoke = metricNumber(zone, "smoke");
    const capacity = metricNumber(zone, "capacity");

    if (typeof temperature === "number" && temperature > 27) {
      alerts.push({
        id: `${zone.id}-temperature`,
        severity: temperature > 30 ? "critical" : "high",
        title: "Temperatura fuera de umbral",
        description: `${zone.name} registra ${temperature.toFixed(1)} C.`,
        zoneId: zone.id,
        zoneName: zone.name,
        isoDomain: "22237-4",
        recommendation: "Revisar HVAC, flujo de aire y separacion de pasillos frio/caliente.",
        createdAt: timestamp,
      });
    }

    if (typeof upsLoad === "number" && upsLoad > 85) {
      alerts.push({
        id: `${zone.id}-ups-load`,
        severity: upsLoad > 92 ? "critical" : "high",
        title: "UPS sobrecargada",
        description: `Carga UPS al ${upsLoad.toFixed(0)}%.`,
        zoneId: zone.id,
        zoneName: zone.name,
        isoDomain: "22237-3",
        recommendation: "Reducir carga, validar redundancia y revisar autonomia disponible.",
        createdAt: timestamp,
      });
    }

    if (typeof capacity === "number" && capacity > 90) {
      alerts.push({
        id: `${zone.id}-capacity`,
        severity: "medium",
        title: "Capacidad tecnica elevada",
        description: `${zone.name} opera al ${capacity.toFixed(0)}% de capacidad.`,
        zoneId: zone.id,
        zoneName: zone.name,
        isoDomain: zone.isoDomains[0],
        recommendation: "Planificar capacidad y mantenimiento preventivo.",
        createdAt: timestamp,
      });
    }

    if (typeof unauthorizedEvents === "number" && unauthorizedEvents > 0) {
      alerts.push({
        id: `${zone.id}-access`,
        severity: "critical",
        title: "Acceso no autorizado",
        description: "Intento de ingreso detectado en zona restringida.",
        zoneId: zone.id,
        zoneName: zone.name,
        isoDomain: "22237-6",
        recommendation: "Validar credenciales, CCTV y registro de acceso fisico.",
        createdAt: timestamp,
      });
    }

    if (typeof smoke === "number" && smoke > 0) {
      alerts.push({
        id: `${zone.id}-smoke`,
        severity: "critical",
        title: "Sensor de humo activo",
        description: "Riesgo de incendio detectado por sensor simulado.",
        zoneId: zone.id,
        zoneName: zone.name,
        isoDomain: "22237-2",
        recommendation: "Ejecutar procedimiento de respuesta, validar supresion y aislar zona.",
        createdAt: timestamp,
      });
    }
  }

  for (const domain of compliance.domains) {
    if (domain.status === "critical") {
      alerts.push({
        id: `${domain.id}-compliance`,
        severity: "high",
        title: `Cumplimiento bajo en ${domain.id}`,
        description: `${domain.title} tiene score ${domain.score}%.`,
        zoneId: "global",
        zoneName: "Cumplimiento ISO",
        isoDomain: domain.id,
        recommendation: "Priorizar controles afectados y documentar evidencias de mitigacion.",
        createdAt: timestamp,
      });
    }
  }

  return alerts;
}
