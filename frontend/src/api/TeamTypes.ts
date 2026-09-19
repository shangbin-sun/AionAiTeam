export type TeamId = string;
export type EmployeeId = string;
export type TaskId = string;
export type RunId = string;
export type EvaluationId = string;
export type CandidateId = string;

export type RunStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed';

export interface EmployeeSummary {
  id: EmployeeId;
  name: string;
  role: string;
  version: number;
}

export interface Team {
  id: TeamId;
  name: string;
  goal: string;
  version: number;
  status: RunStatus;
  employeeCount: number;
  activeRunCount: number;
  employee?: EmployeeSummary[];
  latestArtifactName?: string;
  evaluationStatus?: 'unknown' | 'passing' | 'failing';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: EmployeeId;
  teamId: TeamId;
  name: string;
  role: string;
  version: number;
  rulesMarkdown?: string;
  skills?: string[];
  workflow?: unknown;
  updatedAt: string;
}

export interface SaveEmployeeVersionInput {
  employeeId: EmployeeId;
  rulesMarkdown?: string;
  skills?: string[];
  workflow?: unknown;
  note?: string;
  expectedVersion: number;
}

export interface StartEvaluationInput {
  employeeId: EmployeeId;
  runId?: RunId;
  nodeKey?: string;
}

export interface CreateTaskInput {
  teamId: TeamId;
  title: string;
  brief: string;
}

export interface Task {
  id: TaskId;
  teamId: TeamId;
  title: string;
  brief: string;
  createdAt: string;
}

export interface TaskRun {
  id: RunId;
  taskId: TaskId;
  teamId: TeamId;
  status: RunStatus;
  version: number;
  startedAt: string;
}

export interface Artifact {
  id: string;
  runId: RunId;
  nodeKey?: string;
  name: string;
  sha256: string;
  sizeBytes: number;
  createdAt: string;
}

export interface EmployeeVersion {
  employeeId: EmployeeId;
  version: number;
  createdAt: string;
  note?: string;
}

export interface TimelineEntry {
  id: string;
  at: string;
  kind: string;
  text?: string;
}

export interface TimelinePage {
  entries: TimelineEntry[];
  nextCursor?: string;
}

export interface EvaluationRun {
  id: EvaluationId;
  employeeId: EmployeeId;
  status: RunStatus;
  score?: number;
}

export interface WorkflowCandidate {
  id: CandidateId;
  evaluationId: EvaluationId;
  summary: string;
  baselineScore: number;
  candidateScore: number;
  hasRegressions: boolean;
}
