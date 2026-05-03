export type ZoneStatus = "normal" | "warning" | "critical";

export type ScenarioId =
  | "normal"
  | "efficient"
  | "cooling_failure"
  | "ups_overload"
  | "unauthorized_access"
  | "fire_risk"
  | "high_pue"
  | "recovery";

export type IsoDomainId =
  | "22237-2"
  | "22237-3"
  | "22237-4"
  | "22237-5"
  | "22237-6"
  | "22237-7"
  | "22237-8";

export type Metric = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  status: ZoneStatus;
};

export type DataCenterZone = {
  id: string;
  name: string;
  type: string;
  status: ZoneStatus;
  isoDomains: IsoDomainId[];
  primaryMetric: string;
  metrics: Metric[];
  recommendations: string[];
};

export type GlobalMetrics = {
  complianceScore: number;
  pue: number;
  itLoadKw: number;
  totalPowerKw: number;
  coolingPowerKw: number;
  averageTemperature: number;
  averageHumidity: number;
  availability: number;
  activeAlerts: number;
};

export type DataCenterState = {
  timestamp: string;
  scenario: ScenarioId;
  globalStatus: ZoneStatus;
  globalMetrics: GlobalMetrics;
  zones: DataCenterZone[];
  compliance: ComplianceSummary;
  alerts: Alert[];
  trends: TrendPoint[];
};

export type TrendPoint = {
  time: string;
  pue: number;
  temperature: number;
  power: number;
};

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type Alert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  zoneId: string;
  zoneName: string;
  isoDomain: IsoDomainId;
  recommendation: string;
  createdAt: string;
};

export type ComplianceStatus = "compliant" | "partial" | "non_compliant";

export type ComplianceControl = {
  id: string;
  isoDomain: IsoDomainId;
  title: string;
  description: string;
  status: ComplianceStatus;
  evidence: string;
  risk: string;
};

export type ComplianceDomain = {
  id: IsoDomainId;
  title: string;
  description: string;
  score: number;
  status: ZoneStatus;
  controlsTotal: number;
  controlsCompliant: number;
  risks: string[];
};

export type ComplianceSummary = {
  globalScore: number;
  domains: ComplianceDomain[];
  controls: ComplianceControl[];
};
