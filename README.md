# Zagrebi mobile

React Native/Expo application with scratch-card interaction, reward and advertisement interfaces, audio, settings, and API integration. It demonstrates interactive frontend implementation; no claim about ownership of all assets, production usage, or user metrics is made here.

## Run locally

```sh
npm ci
npm start
```

**Offline demo mode is enabled by default.** It creates a local fixture client, returns deterministic no-prize results, and disables real reward claims/advertisements. No rewards API requests are made in this mode. API changes are in memory and reset when the JavaScript process restarts. Existing image/audio assets still need rights confirmation before publishing a showcase.

For an authorized development backend only, set `EXPO_PUBLIC_DEMO_MODE=false`, `EXPO_PUBLIC_API_URL`, and `EXPO_PUBLIC_FRONTEND_URL` in `.env.local`. Expo public variables are visible to users and must never contain secrets. The live backend must enforce identity, limits, reward integrity, and idempotency; client-side state does not provide those guarantees.

## Engineering decisions

A request gate prevents duplicate reward requests while one is pending and ignores obsolete responses after unmount. Scratch coverage uses a fixed 40×20 grid of stroke samples rather than a bounding rectangle, so one diagonal no longer reveals the entire card. This is an approximation, not pixel-exact coverage. A button offers the same reveal workflow without requiring the gesture. API responses are checked at the boundary; query values are encoded, HTTP failures handled, and requests bounded by a timeout.

Settings load before they are persisted, avoiding overwriting stored preferences during initial hydration. Context state setters are typed. Icon/button controls receive accessibility labels/roles where repaired. A full native screen-reader and device-performance review is still required.

## Checks

```sh
npm run typecheck
npm run test:ci
npm run export:web
```

Tests exercise duplicate requests, stale responses, retry behavior, scratch coverage, query encoding, invalid responses, and HTTP failures, plus the existing text snapshot. Web export proves bundling; it does not prove native gestures, audio, or Skia work on every device. Native builds and device frame-time measurements were not performed.

## Next steps

Confirm authorship and asset rights, record a demo using approved assets, test actual reward/advertisement contracts against an authorized sandbox, and upgrade Expo in a separate change. This app can complement a React web portfolio; it does not replace one.
