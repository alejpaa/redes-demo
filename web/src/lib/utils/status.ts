import type { AlertSeverity, ComplianceStatus, ZoneStatus } from "@/lib/types/datacenter";

export function worstStatus(statuses: ZoneStatus[]): ZoneStatus {
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warning")) return "warning";
  return "normal";
}

export function statusFromScore(score: number): ZoneStatus {
  if (score < 70) return "critical";
  if (score < 85) return "warning";
  return "normal";
}

export function complianceStatusFromScore(score: number): ComplianceStatus {
  if (score < 70) return "non_compliant";
  if (score < 90) return "partial";
  return "compliant";
}

export function statusLabel(status: ZoneStatus): string {
  return {
    normal: "Normal",
    warning: "Advertencia",
    critical: "Critico",
  }[status];
}

export function statusClasses(status: ZoneStatus): string {
  return {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    critical: "border-rose-200 bg-rose-50 text-rose-800",
  }[status];
}

export function severityClasses(severity: AlertSeverity): string {
  return {
    low: "border-sky-200 bg-sky-50 text-sky-800",
    medium: "border-amber-200 bg-amber-50 text-amber-800",
    high: "border-orange-200 bg-orange-50 text-orange-800",
    critical: "border-rose-200 bg-rose-50 text-rose-800",
  }[severity];
}
