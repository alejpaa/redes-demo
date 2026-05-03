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

type DashboardSection = "overview" | "simulation" | "facility" | "metrics" | "compliance" | "alerts";

const dashboardSections: { id: DashboardSection; label: string }[] = [
  { id: "overview", label: "Resumen" },
  { id: "simulation", label: "Escenarios" },
  { id: "facility", label: "Salas" },
  { id: "metrics", label: "Metricas" },
  { id: "compliance", label: "ISO 22237" },
  { id: "alerts", label: "Alertas" },
];

export function DataCenterDashboard() {
  const [state, setState] = useState<DataCenterState | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState("data-hall");
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
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
    <main className="min-h-screen bg-surface px-3 py-4 text-slate-950 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6">
        <header className="rounded-3xl border border-line bg-white p-4 shadow-glow sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-blue-700">
                <ShieldCheck className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.24em]">Digital Twin Compliance</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-5xl">ISO/IEC 22237 Data Center Platform</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Demo profesional en Next.js para monitoreo, riesgos y evidencia simulada de cumplimiento sobre infraestructura fisica de data centers.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-line bg-slate-50 p-4 text-sm text-slate-600 lg:w-auto lg:min-w-64">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Escenario activo</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{state.scenario}</p>
              <p className="mt-1 text-xs text-slate-500">Actualizado: {new Date(state.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

        <nav className="sticky top-3 z-20 rounded-3xl border border-line bg-white/95 p-2 shadow-glow backdrop-blur" aria-label="Secciones del dashboard">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {dashboardSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${activeSection === section.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
              >
                {section.label}
                {section.id === "alerts" && state.alerts.length > 0 ? <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{state.alerts.length}</span> : null}
              </button>
            ))}
          </div>
        </nav>

        {activeSection === "overview" ? <ExecutiveSummary state={state} /> : null}

        {activeSection === "simulation" ? <ScenarioSwitcher activeScenario={state.scenario} isUpdating={isPending} onScenarioChange={changeScenario} /> : null}

        {activeSection === "facility" ? (
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <FacilityMap zones={state.zones} selectedZoneId={selectedZone.id} onSelectZone={setSelectedZoneId} />
            <ZoneDetailPanel zone={selectedZone} alerts={state.alerts} />
          </div>
        ) : null}

        {activeSection === "metrics" ? <MetricsCharts state={state} /> : null}
        {activeSection === "compliance" ? <ComplianceMatrix compliance={state.compliance} /> : null}
        {activeSection === "alerts" ? <AlertsTable alerts={state.alerts} /> : null}

        <footer className="pb-4 text-center text-xs text-slate-500">
          Esta plataforma no certifica ISO/IEC 22237 automaticamente; simula monitoreo, evaluacion y evidencia operacional alineada con la norma.
        </footer>
      </div>
    </main>
  );
}
