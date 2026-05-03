import type { ComplianceSummary } from "@/lib/types/datacenter";
import { statusClasses } from "@/lib/utils/status";

type ComplianceMatrixProps = {
  compliance: ComplianceSummary;
};

export function ComplianceMatrix({ compliance }: ComplianceMatrixProps) {
  return (
    <section className="rounded-3xl border border-line bg-white p-4 shadow-glow sm:p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">Matriz ISO/IEC 22237</h2>
        <p className="text-sm text-slate-500">Evaluacion simulada por dominio de infraestructura fisica.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {compliance.domains.map((domain) => (
          <article key={domain.id} className="rounded-2xl border border-line bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">ISO/IEC {domain.id}</p>
                <h3 className="mt-1 font-semibold text-slate-950">{domain.title}</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClasses(domain.status)}`}>{domain.score}%</span>
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-600">{domain.description}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${domain.score}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-500">Controles cumplidos: {domain.controlsCompliant}/{domain.controlsTotal}</p>
            {domain.risks.length > 0 ? <p className="mt-2 text-xs text-slate-700">Riesgo: {domain.risks[0]}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
