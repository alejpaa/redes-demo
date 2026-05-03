import type { ScenarioId } from "@/lib/types/datacenter";
import { scenarioIds } from "@/lib/simulator/scenarios";

let activeScenario: ScenarioId = "normal";

export function getActiveScenario(): ScenarioId {
  return activeScenario;
}

export function setActiveScenario(nextScenario: ScenarioId): void {
  activeScenario = nextScenario;
}

export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && scenarioIds.includes(value as ScenarioId);
}
