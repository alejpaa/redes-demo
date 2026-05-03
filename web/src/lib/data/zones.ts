import type { DataCenterZone } from "@/lib/types/datacenter";

export const baseZones: Omit<DataCenterZone, "status" | "primaryMetric" | "metrics" | "recommendations">[] = [
  { id: "access-control", name: "Control de Acceso", type: "Seguridad", isoDomains: ["22237-6", "22237-7"] },
  { id: "noc", name: "NOC", type: "Operacion", isoDomains: ["22237-7"] },
  { id: "telecom-room", name: "Sala Telecom", type: "Telecom", isoDomains: ["22237-5", "22237-7"] },
  { id: "ups-room", name: "Sala UPS", type: "Energia", isoDomains: ["22237-3", "22237-7"] },
  { id: "data-hall", name: "Data Hall", type: "TI", isoDomains: ["22237-4", "22237-5", "22237-8"] },
  { id: "hvac-room", name: "Sala HVAC", type: "Climatizacion", isoDomains: ["22237-4", "22237-8"] },
  { id: "generators", name: "Generadores", type: "Energia", isoDomains: ["22237-3", "22237-7"] },
  { id: "battery-room", name: "Sala Baterias", type: "Energia", isoDomains: ["22237-3", "22237-2"] },
  { id: "fire-system", name: "Sistema Incendios", type: "Proteccion", isoDomains: ["22237-2", "22237-6", "22237-7"] },
];
