import type {
  Artifact,
  CreateTaskInput,
  Employee,
  EmployeeVersion,
  EvaluationRun,
  RunId,
  SaveEmployeeVersionInput,
  StartEvaluationInput,
  Task,
  TaskRun,
  Team,
  TimelinePage,
  WorkflowCandidate,
} from './TeamTypes';
import type { TeamEventSource } from './TeamEvents';

export interface TeamClient extends TeamEventSource {
  listTeams(): Promise<Team[]>;
  getTeam(teamId: string): Promise<Team>;

  createTask(input: CreateTaskInput): Promise<Task>;
  startRun(taskId: string): Promise<TaskRun>;
  resumeRun(runId: string): Promise<TaskRun>;

  getTimeline(runId: RunId, nodeKey: string, cursor?: string): Promise<TimelinePage>;
  sendTaskMessage(runId: RunId, nodeKey: string, message: string): Promise<void>;

  getArtifacts(runId: RunId, nodeKey?: string): Promise<Artifact[]>;

  getEmployee(employeeId: string): Promise<Employee>;
  saveEmployeeVersion(input: SaveEmployeeVersionInput): Promise<EmployeeVersion>;

  startEvaluation(input: StartEvaluationInput): Promise<EvaluationRun>;
  optimizeWorkflow(evaluationId: string): Promise<WorkflowCandidate>;
  adoptCandidate(candidateId: string): Promise<EmployeeVersion>;
}
