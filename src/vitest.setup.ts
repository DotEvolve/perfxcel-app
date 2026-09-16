import "@testing-library/jest-dom";
import { vi } from "vitest";

// Prevent Sentry from initialising during tests. The config/sentry module
// guards on VITE_SENTRY_DSN, which is not set in the test environment, so
// initializeReactSentry is never called. We mock the Sentry namespace used
// in api.ts and App.tsx to avoid "not initialised" warnings in test output.
vi.mock("@dotevolve/error-utils/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@dotevolve/error-utils/react")>();
  return {
    ...actual,
    Sentry: {
      ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
      captureException: vi.fn(),
      withScope: vi.fn((cb: (scope: unknown) => void) => cb({ setTag: vi.fn(), setContext: vi.fn() })),
      getCurrentScope: vi.fn(() => ({ setTag: vi.fn() })),
    },
  };
});
