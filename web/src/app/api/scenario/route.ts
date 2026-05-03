import { isScenarioId, setActiveScenario } from "@/lib/simulator/scenario-store";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const scenario = typeof body === "object" && body !== null && "scenario" in body ? body.scenario : undefined;

  if (!isScenarioId(scenario)) {
    return Response.json({ ok: false, error: "Invalid scenario" }, { status: 400 });
  }

  setActiveScenario(scenario);
  return Response.json({ ok: true, scenario });
}
