import type { ScenarioId } from "@/lib/types/datacenter";
import { scenarios } from "@/lib/simulator/scenarios";

type ScenarioSwitcherProps = {
  activeScenario: ScenarioId;
  isUpdating: boolean;
  onScenarioChange: (scenario: ScenarioId) => void;
};

export function ScenarioSwitcher({ activeScenario, isUpdating, onScenarioChange }: ScenarioSwitcherProps) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-glow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">Simulador de Escenarios</h2>
        <p className="text-sm text-slate-500">Cambia el estado operativo del data center desde la web.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(scenarios) as ScenarioId[]).map((scenario) => (
          <button
            key={scenario}
            type="button"
            disabled={isUpdating}
            onClick={() => onScenarioChange(scenario)}
            className={`rounded-2xl border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 ${activeScenario === scenario ? "border-blue-400 bg-blue-50 ring-4 ring-blue-100" : "border-line bg-white"}`}
          >
            <p className="font-semibold text-slate-950">{scenarios[scenario].label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{scenarios[scenario].description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
