# AionAiTeam

AI Team feature for AionUi. A single repository (monorepo) consumed by two
upstream host projects through git submodules:

- `frontend/` — AI Team UI package, mounted into AionUi at `packages/ai-team`.
  It is bundled by AionUi's renderer build so it can reuse `@renderer/*`.
- `backend/` — Python (FastAPI) service, mounted into AionCore at the
  corresponding integration location.

The two directories evolve together on one branch so frontend/backend contract
changes land in a single commit.
