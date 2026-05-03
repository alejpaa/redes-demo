import type { IsoDomainId } from "@/lib/types/datacenter";

export const isoDomains: Record<IsoDomainId, { title: string; description: string }> = {
  "22237-2": {
    title: "Construccion del edificio",
    description: "Riesgos fisicos, separacion de areas tecnicas y proteccion de la instalacion.",
  },
  "22237-3": {
    title: "Distribucion electrica",
    description: "Capacidad, redundancia, UPS, generadores y continuidad electrica.",
  },
  "22237-4": {
    title: "Control ambiental",
    description: "Temperatura, humedad, flujo de aire y climatizacion del data center.",
  },
  "22237-5": {
    title: "Cableado de telecomunicaciones",
    description: "Canalizaciones, racks, cableado estructurado e interconexion.",
  },
  "22237-6": {
    title: "Seguridad fisica",
    description: "Control de acceso, CCTV, zonas restringidas y eventos de intrusiones.",
  },
  "22237-7": {
    title: "Gestion y operacion",
    description: "Mantenimiento, monitoreo, incidentes, continuidad y operacion diaria.",
  },
  "22237-8": {
    title: "Eficiencia energetica",
    description: "PUE, eficiencia de climatizacion y consumo energetico total.",
  },
};
