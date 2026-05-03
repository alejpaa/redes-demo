import type { DataCenterState } from "@/lib/types/datacenter";
import { statusLabel } from "@/lib/utils/status";
import { StatusCard } from "@/components/dashboard/status-card";

type ExecutiveSummaryProps = {
  state: DataCenterState;
};

export function ExecutiveSummary({ state }: ExecutiveSummaryProps) {
  const { globalMetrics } = state;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatusCard label="Cumplimiento ISO" value={`${globalMetrics.complianceScore}%`} detail="Score ponderado por dominios 22237" status={state.globalStatus} />
      <StatusCard label="PUE" value={globalMetrics.pue.toFixed(2)} detail="Eficiencia energetica simulada" status={globalMetrics.pue > 1.8 ? "warning" : "normal"} />
      <StatusCard label="Temperatura media" value={`${globalMetrics.averageTemperature} C`} detail="Promedio de salas criticas" status={globalMetrics.averageTemperature > 27 ? "warning" : "normal"} />
      <StatusCard label="Estado global" value={statusLabel(state.globalStatus)} detail={`${globalMetrics.activeAlerts} alertas activas`} status={state.globalStatus} />
    </div>
  );
}
