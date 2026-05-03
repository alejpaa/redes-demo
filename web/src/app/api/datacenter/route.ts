import { getActiveScenario } from "@/lib/simulator/scenario-store";
import { generateDataCenterState } from "@/lib/simulator/datacenter-simulator";

export const dynamic = "force-dynamic";

export function GET() {
  const state = generateDataCenterState(getActiveScenario());
  return Response.json(state);
}
