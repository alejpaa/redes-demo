import { statusClasses } from "@/lib/utils/status";
import type { ZoneStatus } from "@/lib/types/datacenter";

type StatusCardProps = {
  label: string;
  value: string;
  detail: string;
  status: ZoneStatus;
};

export function StatusCard({ label, value, detail, status }: StatusCardProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full border ${statusClasses(status)}`} aria-label={status} />
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
      <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
    </section>
  );
}
