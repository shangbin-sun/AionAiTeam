# frontend

AI Team UI. Mounted into AionUi as the `packages/ai-team` submodule and bundled
by AionUi's electron-vite renderer build, so code here can import AionUi
components through the `@renderer/*`, `@common/*` and `@/*` aliases.

Layout (to be added):

```
src/
  host/      # only layer allowed to import @renderer / @common AionUi internals
  api/       # TeamClient protocol, types, events, mock + http implementations
  pages/
  components/
  state/
  index.tsx  # routes and feature entry
```
