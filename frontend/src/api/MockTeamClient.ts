import EventEmitter from 'eventemitter3';
import type { TeamClient } from './TeamClient';
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
import {
  TeamEvent,
  type TeamEventName,
  type TeamEventHandler,
  type TeamEventPayload,
} from './TeamEvents';

const now = () => new Date().toISOString();

const delay = (ms = 240) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const MOCK_TEAMS: Team[] = [
  {
    id: 'team-requirements',
    name: '需求分析团队',
    goal: '将用户想法整理成可执行的需求规格与验收标准',
    version: 3,
    status: 'running',
    employeeCount: 3,
    activeRunCount: 1,
    latestArtifactName: 'PRD-v3.md',
    evaluationStatus: 'passing',
    createdAt: '2026-09-10T08:00:00.000Z',
    updatedAt: now(),
  },
  {
    id: 'team-development',
    name: '全栈开发团队',
    goal: '依据需求完成功能开发、自测与交付',
    version: 5,
    status: 'idle',
    employeeCount: 4,
    activeRunCount: 0,
    latestArtifactName: 'release-notes.md',
    evaluationStatus: 'unknown',
    createdAt: '2026-09-08T08:00:00.000Z',
    updatedAt: '2026-09-17T02:11:00.000Z',
  },
  {
    id: 'team-review',
    name: '评审与质量团队',
    goal: '对交付物做规则检查、模型评测与回归把关',
    version: 2,
    status: 'failed',
    employeeCount: 2,
    activeRunCount: 0,
    latestArtifactName: 'qa-report.json',
    evaluationStatus: 'failing',
    createdAt: '2026-09-12T08:00:00.000Z',
    updatedAt: '2026-09-18T11:42:00.000Z',
  },
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-analyst',
    teamId: 'team-requirements',
    name: '需求分析师',
    role: '梳理需求、澄清问题、产出 PRD',
    version: 3,
    skills: ['interviewing', 'prd-writing'],
    updatedAt: now(),
  },
  {
    id: 'emp-dev',
    teamId: 'team-development',
    name: '全栈工程师',
    role: '功能开发与自测',
    version: 5,
    skills: ['typescript', 'rust'],
    updatedAt: '2026-09-17T02:11:00.000Z',
  },
];

class MockTeamClient implements TeamClient {
  private emitter = new EventEmitter<TeamEventName>();
  private teams: Team[] = MOCK_TEAMS.map((team) => ({ ...team }));
  private employees: Employee[] = MOCK_EMPLOYEES.map((employee) => ({ ...employee }));

  subscribe(event: TeamEventName, handler: TeamEventHandler): () => void {
    this.emitter.on(event, handler);
    return () => this.emitter.off(event, handler);
  }

  private emit(event: TeamEventName, payload: Omit<TeamEventPayload, 'at'>): void {
    this.emitter.emit(event, { ...payload, at: now() });
  }

  async listTeams(): Promise<Team[]> {
    await delay();
    return this.teams.map((team) => ({ ...team }));
  }

  async getTeam(teamId: string): Promise<Team> {
    await delay();
    const team = this.teams.find((item) => item.id === teamId);
    if (!team) throw new Error(`team not found: ${teamId}`);
    return { ...team };
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    await delay();
    const task: Task = {
      id: `task-${Math.random().toString(36).slice(2, 8)}`,
      teamId: input.teamId,
      title: input.title,
      brief: input.brief,
      createdAt: now(),
    };
    this.emit(TeamEvent.TaskCreated, { teamId: input.teamId });
    return task;
  }

  async startRun(taskId: string): Promise<TaskRun> {
    await delay();
    const run: TaskRun = {
      id: `run-${Math.random().toString(36).slice(2, 8)}`,
      taskId,
      teamId: this.teams[0]?.id ?? '',
      status: 'running',
      version: 1,
      startedAt: now(),
    };
    this.emit(TeamEvent.NodeQueued, { runId: run.id });
    return run;
  }

  async resumeRun(runId: string): Promise<TaskRun> {
    await delay();
    return {
      id: runId,
      taskId: 'task-mock',
      teamId: this.teams[0]?.id ?? '',
      status: 'running',
      version: 1,
      startedAt: now(),
    };
  }

  async getTimeline(
    _runId: RunId,
    _nodeKey: string,
    _cursor?: string
  ): Promise<TimelinePage> {
    await delay(120);
    return { entries: [], nextCursor: undefined };
  }

  async sendTaskMessage(
    runId: RunId,
    nodeKey: string,
    message: string
  ): Promise<void> {
    await delay(120);
    this.emit(TeamEvent.ChatUserMessage, { runId, nodeKey, message });
  }

  async getArtifacts(_runId: RunId, _nodeKey?: string): Promise<Artifact[]> {
    await delay(120);
    return [];
  }

  async getEmployee(employeeId: string): Promise<Employee> {
    await delay();
    const employee = this.employees.find((item) => item.id === employeeId);
    if (!employee) throw new Error(`employee not found: ${employeeId}`);
    return { ...employee };
  }

  async saveEmployeeVersion(input: SaveEmployeeVersionInput): Promise<EmployeeVersion> {
    await delay();
    const employee = this.employees.find((item) => item.id === input.employeeId);
    if (!employee) throw new Error(`employee not found: ${input.employeeId}`);
    employee.version = input.expectedVersion + 1;
    if (input.rulesMarkdown !== undefined) employee.rulesMarkdown = input.rulesMarkdown;
    if (input.skills) employee.skills = [...input.skills];
    if (input.workflow !== undefined) employee.workflow = input.workflow;
    employee.updatedAt = now();
    return { employeeId: employee.id, version: employee.version, createdAt: now(), note: input.note };
  }

  async startEvaluation(input: StartEvaluationInput): Promise<EvaluationRun> {
    await delay();
    const evaluation: EvaluationRun = {
      id: `eval-${Math.random().toString(36).slice(2, 8)}`,
      employeeId: input.employeeId,
      status: 'running',
    };
    this.emit(TeamEvent.EvaluationStarted, { runId: input.runId, nodeKey: input.nodeKey });
    return evaluation;
  }

  async optimizeWorkflow(evaluationId: string): Promise<WorkflowCandidate> {
    await delay();
    return {
      id: `cand-${Math.random().toString(36).slice(2, 8)}`,
      evaluationId,
      summary: '收紧输出契约并补充示例（mock 候选）',
      baselineScore: 82,
      candidateScore: 89,
      hasRegressions: false,
    };
  }

  async adoptCandidate(_candidateId: string): Promise<EmployeeVersion> {
    await delay();
    const employee = this.employees[0];
    employee.version += 1;
    this.emit(TeamEvent.WorkflowAdopted, {});
    return { employeeId: employee.id, version: employee.version, createdAt: now() };
  }
}

export function createMockTeamClient(): TeamClient {
  return new MockTeamClient();
}
