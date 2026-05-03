import { baseZones } from "@/lib/data/zones";
import { generateAlerts } from "@/lib/iso/alert-engine";
import { evaluateCompliance } from "@/lib/iso/compliance-engine";
import type { DataCenterState, DataCenterZone, Metric, ScenarioId, ZoneStatus } from "@/lib/types/datacenter";
import { worstStatus } from "@/lib/utils/status";

function wave(seed: number, amplitude: number): number {
  return Math.sin(Date.now() / 12000 + seed) * amplitude;
}

function metric(key: string, label: string, value: number | string, unit: string | undefined, status: ZoneStatus): Metric {
  return { key, label, value, unit, status };
}

function statusByThreshold(value: number, warning: number, critical: number): ZoneStatus {
  if (value >= critical) return "critical";
  if (value >= warning) return "warning";
  return "normal";
}

function scenarioModifiers(scenario: ScenarioId) {
  return {
    temp: scenario === "cooling_failure" ? 7 : scenario === "high_pue" ? 2 : scenario === "efficient" ? -2 : scenario === "recovery" ? 1 : 0,
    hvac: scenario === "cooling_failure" ? 35 : scenario === "high_pue" ? 18 : scenario === "efficient" ? -12 : scenario === "recovery" ? 8 : 0,
    ups: scenario === "ups_overload" ? 28 : scenario === "recovery" ? 8 : scenario === "efficient" ? -8 : 0,
    pue: scenario === "high_pue" ? 0.38 : scenario === "cooling_failure" ? 0.28 : scenario === "efficient" ? -0.18 : scenario === "recovery" ? 0.1 : 0,
    access: scenario === "unauthorized_access" ? 1 : 0,
    smoke: scenario === "fire_risk" ? 1 : 0,
  };
}

function buildZones(scenario: ScenarioId): DataCenterZone[] {
  const mod = scenarioModifiers(scenario);
  const dataTemp = 22.5 + mod.temp + wave(1, 0.8);
  const humidity = 47 + (scenario === "cooling_failure" ? 9 : 0) + wave(2, 2.4);
  const upsLoad = 63 + mod.ups + wave(3, 4);
  const runtime = Math.max(8, 32 - Math.max(0, upsLoad - 70) * 0.7);
  const hvacCapacity = 62 + mod.hvac + wave(4, 3);
  const telecomCapacity = 71 + (scenario === "recovery" ? 15 : 0) + wave(5, 2);

  return baseZones.map((zone) => {
    let metrics: Metric[] = [];
    let recommendations: string[] = ["Mantener monitoreo continuo y evidencia operacional actualizada."];

    if (zone.id === "data-hall") {
      const tempStatus = statusByThreshold(dataTemp, 27, 30);
      const humStatus = humidity < 40 || humidity > 60 ? "warning" : "normal";
      metrics = [
        metric("temperature", "Temperatura", Number(dataTemp.toFixed(1)), "C", tempStatus),
        metric("humidity", "Humedad", Number(humidity.toFixed(0)), "%", humStatus),
        metric("racks", "Racks activos", 18, "/20", "normal"),
        metric("itLoad", "Carga TI", Number((78 + wave(6, 5)).toFixed(1)), "kW", "normal"),
      ];
      recommendations = tempStatus === "normal" ? recommendations : ["Balancear carga termica y verificar pasillos frio/caliente."];
    }

    if (zone.id === "hvac-room") {
      const capacityStatus = statusByThreshold(hvacCapacity, 85, 96);
      metrics = [
        metric("capacity", "Capacidad HVAC", Number(hvacCapacity.toFixed(0)), "%", capacityStatus),
        metric("supplyTemp", "Aire suministro", Number((17 + mod.temp * 0.25).toFixed(1)), "C", capacityStatus),
        metric("coolingPower", "Consumo frio", Number((42 + mod.hvac * 0.8).toFixed(1)), "kW", capacityStatus),
      ];
      recommendations = capacityStatus === "normal" ? recommendations : ["Revisar CRAC/chiller, filtros y capacidad disponible."];
    }

    if (zone.id === "ups-room") {
      const upsStatus = statusByThreshold(upsLoad, 85, 92);
      const runtimeStatus = runtime < 15 ? "warning" : "normal";
      metrics = [
        metric("upsLoad", "Carga UPS", Number(upsLoad.toFixed(0)), "%", upsStatus),
        metric("runtime", "Autonomia", Number(runtime.toFixed(0)), "min", runtimeStatus),
        metric("redundancy", "Redundancia", scenario === "ups_overload" ? "N" : "N+1", undefined, upsStatus),
      ];
      recommendations = upsStatus === "normal" ? recommendations : ["Validar redundancia N+1 y redistribuir cargas criticas."];
    }

    if (zone.id === "access-control") {
      const status = mod.access > 0 ? "critical" : "normal";
      metrics = [
        metric("unauthorizedEvents", "Accesos no autorizados", mod.access, undefined, status),
        metric("cctv", "CCTV", "Activo", undefined, "normal"),
        metric("doors", "Puertas seguras", mod.access > 0 ? 7 : 8, "/8", status),
      ];
      recommendations = status === "normal" ? recommendations : ["Bloquear credencial, revisar CCTV y registrar incidente."];
    }

    if (zone.id === "fire-system") {
      const status = mod.smoke > 0 ? "critical" : "normal";
      metrics = [
        metric("smoke", "Humo detectado", mod.smoke, undefined, status),
        metric("suppression", "Supresion", mod.smoke > 0 ? "Pre-alerta" : "Lista", undefined, status),
        metric("lastTest", "Ultima prueba", "Hace 6 dias", undefined, "normal"),
      ];
      recommendations = status === "normal" ? recommendations : ["Ejecutar procedimiento de emergencia y validar supresion."];
    }

    if (zone.id === "telecom-room") {
      const status = statusByThreshold(telecomCapacity, 88, 95);
      metrics = [
        metric("patchCapacity", "Ocupacion patch", Number(telecomCapacity.toFixed(0)), "%", status),
        metric("links", "Enlaces activos", 42, undefined, "normal"),
        metric("cabling", "Cableado", status === "normal" ? "Ordenado" : "Saturado", undefined, status),
      ];
      recommendations = status === "normal" ? recommendations : ["Planificar crecimiento de patch panels y rutas de cableado."];
    }

    if (zone.id === "noc") {
      metrics = [
        metric("incidents", "Incidentes abiertos", scenario === "normal" || scenario === "efficient" ? 1 : 4, undefined, scenario === "normal" || scenario === "efficient" ? "normal" : "warning"),
        metric("monitoring", "Monitoreo", "24/7", undefined, "normal"),
      ];
    }

    if (zone.id === "generators") {
      metrics = [
        metric("fuel", "Combustible", scenario === "recovery" ? 58 : 82, "%", scenario === "recovery" ? "warning" : "normal"),
        metric("lastTest", "Ultima prueba", "Hace 3 dias", undefined, "normal"),
      ];
    }

    if (zone.id === "battery-room") {
      metrics = [
        metric("batteryHealth", "Salud baterias", scenario === "ups_overload" ? 78 : 93, "%", scenario === "ups_overload" ? "warning" : "normal"),
        metric("temperature", "Temperatura", Number((22 + wave(7, 0.5)).toFixed(1)), "C", "normal"),
      ];
    }

    const status = metrics.length > 0 ? worstStatus(metrics.map((item) => item.status)) : "normal";
    const primaryMetric = metrics[0] ? `${metrics[0].value}${metrics[0].unit ? ` ${metrics[0].unit}` : ""}` : "Sin datos";

    return { ...zone, status, primaryMetric, metrics, recommendations };
  });
}

export function generateDataCenterState(scenario: ScenarioId): DataCenterState {
  const timestamp = new Date().toISOString();
  const mod = scenarioModifiers(scenario);
  const zones = buildZones(scenario);
  const itLoadKw = 78 + wave(8, 5);
  const coolingPowerKw = 38 + mod.hvac * 0.8 + wave(9, 2);
  const totalPowerKw = itLoadKw + coolingPowerKw + 18;
  const pue = Math.max(1.18, totalPowerKw / itLoadKw + mod.pue * 0.35);
  const complianceBase = evaluateCompliance(zones, pue);
  const alerts = generateAlerts(zones, complianceBase, timestamp);
  const globalStatus = worstStatus([complianceBase.globalScore < 70 ? "critical" : complianceBase.globalScore < 85 ? "warning" : "normal", ...zones.map((zone) => zone.status)]);
  const compliance = {
    ...complianceBase,
    globalScore: Math.max(45, complianceBase.globalScore - Math.min(alerts.length * 2, 12)),
  };

  return {
    timestamp,
    scenario,
    globalStatus,
    globalMetrics: {
      complianceScore: compliance.globalScore,
      pue: Number(pue.toFixed(2)),
      itLoadKw: Number(itLoadKw.toFixed(1)),
      totalPowerKw: Number(totalPowerKw.toFixed(1)),
      coolingPowerKw: Number(coolingPowerKw.toFixed(1)),
      averageTemperature: Number((22.8 + mod.temp * 0.55 + wave(10, 0.5)).toFixed(1)),
      averageHumidity: Number((47 + (scenario === "cooling_failure" ? 5 : 0) + wave(11, 1.5)).toFixed(0)),
      availability: Number((scenario === "normal" || scenario === "efficient" ? 99.98 : 99.86).toFixed(2)),
      activeAlerts: alerts.length,
    },
    zones,
    compliance,
    alerts,
    trends: Array.from({ length: 12 }, (_, index) => ({
      time: `${index * 5}s`,
      pue: Number((pue + Math.sin(index / 2) * 0.04).toFixed(2)),
      temperature: Number((22.8 + mod.temp * 0.55 + Math.sin(index / 2) * 0.6).toFixed(1)),
      power: Number((totalPowerKw + Math.sin(index / 3) * 4).toFixed(1)),
    })),
  };
}
