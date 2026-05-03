"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DataCenterState } from "@/lib/types/datacenter";

type MetricsChartsProps = {
  state: DataCenterState;
};

export function MetricsCharts({ state }: MetricsChartsProps) {
  const zonePower = state.zones
    .filter((zone) => ["data-hall", "hvac-room", "ups-room", "telecom-room"].includes(zone.id))
    .map((zone) => ({ name: zone.name, value: Number(zone.metrics[0]?.value) || 0 }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-3xl border border-line bg-white p-4 shadow-glow sm:p-5">
        <h2 className="text-xl font-semibold text-slate-950">Tendencia PUE y Temperatura</h2>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={state.trends}>
              <defs>
                <linearGradient id="pue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dbe4f0", borderRadius: 12, color: "#0f172a" }} />
              <Area type="monotone" dataKey="pue" stroke="#2563eb" fill="url(#pue)" />
              <Area type="monotone" dataKey="temperature" stroke="#e11d48" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-3xl border border-line bg-white p-4 shadow-glow sm:p-5">
        <h2 className="text-xl font-semibold text-slate-950">Indicadores Por Sala</h2>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zonePower}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dbe4f0", borderRadius: 12, color: "#0f172a" }} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
