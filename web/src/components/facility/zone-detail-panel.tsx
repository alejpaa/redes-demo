import type { Alert, DataCenterZone } from "@/lib/types/datacenter";
import { statusClasses, statusLabel } from "@/lib/utils/status";

type ZoneDetailPanelProps = {
  zone?: DataCenterZone;
  alerts: Alert[];
};

export function ZoneDetailPanel({ zone, alerts }: ZoneDetailPanelProps) {
  if (!zone) return null;

  const zoneAlerts = alerts.filter((alert) => alert.zoneId === zone.id);

  return (
    <aside className="rounded-3xl border border-line bg-white p-5 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-700">Detalle de zona</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{zone.name}</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${statusClasses(zone.status)}`}>{statusLabel(zone.status)}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {zone.metrics.map((item) => (
          <div key={item.key} className="rounded-2xl border border-line bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {item.value} {item.unit}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-950">Recomendaciones</h3>
        {zone.recommendations.map((item) => (
          <p key={item} className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{item}</p>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-950">Alertas de la zona</h3>
        {zoneAlerts.length === 0 ? <p className="mt-2 text-sm text-slate-500">Sin alertas activas.</p> : null}
        {zoneAlerts.map((alert) => (
          <p key={alert.id} className="mt-2 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-800">{alert.title}: {alert.recommendation}</p>
        ))}
      </div>
    </aside>
  );
}
