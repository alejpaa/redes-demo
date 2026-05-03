"use client";

import { useEffect, useState, useTransition } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import { AlertsTable } from "@/components/alerts/alerts-table";
import { ComplianceMatrix } from "@/components/compliance/compliance-matrix";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { FacilityMap } from "@/components/facility/facility-map";
import { ZoneDetailPanel } from "@/components/facility/zone-detail-panel";
import { MetricsCharts } from "@/components/metrics/metrics-charts";
import { ScenarioSwitcher } from "@/components/simulation/scenario-switcher";
import type { DataCenterState, ScenarioId } from "@/lib/types/datacenter";

export function DataCenterDashboard() {
  const [state, setState] = useState<DataCenterState | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState("data-hall");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function loadState() {
    try {
      const response = await fetch("/api/datacenter", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo consultar /api/datacenter");
      const nextState = (await response.json()) as DataCenterState;
      setState(nextState);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error desconocido");
    }
  }

  useEffect(() => {
    const firstLoad = window.setTimeout(() => void loadState(), 0);
    const interval = window.setInterval(() => void loadState(), 2000);
    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(interval);
    };
  }, []);

  function changeScenario(scenario: ScenarioId) {
    startTransition(async () => {
      const response = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });

      if (!response.ok) {
        setError("No se pudo cambiar el escenario.");
        return;
      }

      await loadState();
    });
  }

  if (!state) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-slate-950">
        <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-glow">
          <Activity className="mx-auto h-10 w-10 animate-pulse text-blue-600" />
          <p className="mt-4 text-lg font-semibold">Cargando plataforma ISO/IEC 22237...</p>
          {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
        </div>
      </main>
    );
  }

  const selectedZone = state.zones.find((zone) => zone.id === selectedZoneId) ?? state.zones[0];

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-line bg-white p-6 shadow-glow">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-blue-700">
                <ShieldCheck className="h-6 w-6" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">Digital Twin Compliance</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">ISO/IEC 22237 Data Center Platform</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Demo profesional en Next.js para monitoreo, riesgos y evidencia simulada de cumplimiento sobre infraestructura fisica de data centers.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-slate-50 p-4 text-sm text-slate-600">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Escenario activo</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{state.scenario}</p>
              <p className="mt-1 text-xs text-slate-500">Actualizado: {new Date(state.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

        <ExecutiveSummary state={state} />
        <ScenarioSwitcher activeScenario={state.scenario} isUpdating={isPending} onScenarioChange={changeScenario} />

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <FacilityMap zones={state.zones} selectedZoneId={selectedZone.id} onSelectZone={setSelectedZoneId} />
          <ZoneDetailPanel zone={selectedZone} alerts={state.alerts} />
        </div>

        <MetricsCharts state={state} />
        <ComplianceMatrix compliance={state.compliance} />
        <AlertsTable alerts={state.alerts} />

        <footer className="pb-4 text-center text-xs text-slate-500">
          Esta plataforma no certifica ISO/IEC 22237 automaticamente; simula monitoreo, evaluacion y evidencia operacional alineada con la norma.
        </footer>
      </div>
    </main>
  );
}
