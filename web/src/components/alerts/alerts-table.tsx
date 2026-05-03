import type { Alert } from "@/lib/types/datacenter";
import { severityClasses } from "@/lib/utils/status";

type AlertsTableProps = {
  alerts: Alert[];
};

export function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Alertas y Riesgos</h2>
          <p className="text-sm text-slate-500">Eventos relacionados con controles ISO/IEC 22237.</p>
        </div>
        <span className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{alerts.length} activas</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Severidad</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Evento</th>
              <th className="px-4 py-3">ISO</th>
              <th className="px-4 py-3">Recomendacion</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Sin alertas activas.</td>
              </tr>
            ) : null}
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-line text-slate-700">
                <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-xs ${severityClasses(alert.severity)}`}>{alert.severity}</span></td>
                <td className="px-4 py-3">{alert.zoneName}</td>
                <td className="px-4 py-3">{alert.title}</td>
                <td className="px-4 py-3">{alert.isoDomain}</td>
                <td className="px-4 py-3 text-slate-600">{alert.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
