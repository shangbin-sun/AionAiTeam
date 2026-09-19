export const TeamEvent = {
  TaskCreated: 'task.created',
  NodeQueued: 'node.queued',
  NodeStarted: 'node.started',
  ChatUserMessage: 'chat.user_message',
  ChatAssistantMessage: 'chat.assistant_message',
  ToolStarted: 'tool.started',
  ToolCompleted: 'tool.completed',
  FileCreated: 'file.created',
  FileChanged: 'file.changed',
  ArtifactPublished: 'artifact.published',
  NodeCompleted: 'node.completed',
  NodeFailed: 'node.failed',
  EvaluationStarted: 'evaluation.started',
  EvaluationCompleted: 'evaluation.completed',
  WorkflowAdopted: 'workflow.adopted',
} as const;

export type TeamEventName = (typeof TeamEvent)[keyof typeof TeamEvent];

export interface TeamEventPayload {
  teamId?: string;
  runId?: string;
  nodeKey?: string;
  message?: string;
  at: string;
}

export type TeamEventHandler = (payload: TeamEventPayload) => void;

export interface TeamEventSource {
  subscribe(event: TeamEventName, handler: TeamEventHandler): () => void;
}
