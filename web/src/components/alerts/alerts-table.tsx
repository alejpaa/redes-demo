import type { Alert } from "@/lib/types/datacenter";
import { severityClasses } from "@/lib/utils/status";

type AlertsTableProps = {
  alerts: Alert[];
};

export function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <section className="rounded-3xl border border-line bg-white p-4 shadow-glow sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Alertas y Riesgos</h2>
          <p className="text-sm text-slate-500">Eventos relacionados con controles ISO/IEC 22237.</p>
        </div>
        <span className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{alerts.length} activas</span>
      </div>

      <div className="grid gap-3 md:hidden">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-line bg-slate-50 p-5 text-center text-sm text-slate-500">Sin alertas activas.</div>
        ) : null}
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-1 text-xs ${severityClasses(alert.severity)}`}>{alert.severity}</span>
              <span className="rounded-full border border-line bg-slate-50 px-2 py-1 text-xs text-slate-600">{alert.isoDomain}</span>
            </div>
            <h3 className="mt-3 font-semibold text-slate-950">{alert.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{alert.zoneName}</p>
            <p className="mt-3 text-sm leading-5 text-slate-700">{alert.recommendation}</p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white md:block">
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
