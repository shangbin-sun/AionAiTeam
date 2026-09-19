import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AionShellAdapter {
  openTeam(teamId: string): void;
}

export function useAionShell(): AionShellAdapter {
  const navigate = useNavigate();

  const openTeam = useCallback(
    (teamId: string) => {
      navigate(`/team/${teamId}`);
    },
    [navigate]
  );

  return { openTeam };
}
