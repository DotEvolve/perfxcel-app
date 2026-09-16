/// <reference types="vite/client" />
import { initializeReactSentry } from "@dotevolve/error-utils/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

/**
 * Initialise Sentry for the perfxcel-app frontend.
 *
 * No-ops when VITE_SENTRY_DSN is not set (local dev without a DSN).
 * Must be imported before React renders — see main.tsx.
 *
 * Features enabled:
 *  - Error tracking (all unhandled exceptions)
 *  - Browser tracing (page loads, navigation, HTTP requests)
 *  - Browser profiling (JS execution profiles)
 *  - Session replay (10% of sessions; 100% of sessions with an error)
 *  - Console log capture (log, warn, error forwarded to Sentry)
 *  - Data sanitisation (sensitive fields stripped from events)
 */
if (dsn) {
  initializeReactSentry({
    dsn,
    // Falls back to Vite's built-in MODE ("development" / "production")
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    // Optional — set VITE_APP_VERSION (e.g. git SHA) to link events to a release
    release: import.meta.env.VITE_APP_VERSION,

    // Capture 100% of transactions — adjust downward if volume is high
    tracesSampleRate: 1.0,

    // Replay: 10% of all sessions, 100% of sessions that contain an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Profile 100% of sampled sessions
    profileSessionSampleRate: 1.0,

    // Forward console.log / warn / error to Sentry Logs
    enableLogs: true,

    // Never emit Sentry SDK debug output in the browser console
    debug: false,

    // Suppress noisy network / browser lifecycle errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      /^Network Error$/,
      /^Request aborted$/,
      /^timeout of \d+ms exceeded$/,
    ],
  });
}
