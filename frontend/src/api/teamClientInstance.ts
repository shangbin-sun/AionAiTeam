import type { TeamClient } from './TeamClient';
import { createMockTeamClient } from './MockTeamClient';

let client: TeamClient = createMockTeamClient();

export function getTeamClient(): TeamClient {
  return client;
}

export function setTeamClient(next: TeamClient): void {
  client = next;
}
