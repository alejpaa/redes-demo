import type { DataCenterZone } from "@/lib/types/datacenter";
import { statusClasses, statusLabel } from "@/lib/utils/status";

type FacilityMapProps = {
  zones: DataCenterZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
};

export function FacilityMap({ zones, selectedZoneId, onSelectZone }: FacilityMapProps) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-glow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Mapa del Data Center</h2>
          <p className="text-sm text-slate-500">Gemelo digital simplificado por habitaciones criticas.</p>
        </div>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Facility View</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            className={`min-h-32 rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${selectedZoneId === zone.id ? "border-blue-400 ring-4 ring-blue-100" : "border-line"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{zone.type}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{zone.name}</h3>
              </div>
              <span className={`rounded-full border px-2 py-1 text-xs ${statusClasses(zone.status)}`}>{statusLabel(zone.status)}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-950">{zone.primaryMetric}</p>
            <p className="mt-2 text-xs text-slate-500">ISO: {zone.isoDomains.join(" / ")}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
