// Dialog.tsx — React view driven by the verified reducer.

import { useEffect, useReducer } from "react";
import {
  initialState,
  dialogReducer,
  assertStateInvariant,
  assertNoPendingIfSettled,
  type DialogState,
  type DialogStateShape,
} from "./dialogReducer";

interface DialogProps {
  animationMs?: number;
  confirmDelayMs?: number;
}

export function Dialog(props: DialogProps = {}) {
  const animationMs = props.animationMs ?? 200;
  const confirmDelayMs = props.confirmDelayMs ?? 100;

  const [s, dispatch] = useReducer(dialogReducer, initialState);

  // Post-condition invariant assertions after every render.
  // In production these would be dev-only; here we keep them on to surface
  // any bypass of the type system during development.
  useEffect(() => {
    assertStateInvariant(s);
    assertNoPendingIfSettled(s);
  }, [s]);

  // Drives FinishOpen after animation duration.
  useEffect(() => {
    if (s.state !== "opening") return;
    const t = setTimeout(() => dispatch({ type: "FINISH_OPEN" }), animationMs);
    return () => clearTimeout(t);
  }, [s.state, animationMs]);

  // Drives FinishClose after animation duration.
  useEffect(() => {
    if (s.state !== "closing") return;
    const t = setTimeout(() => dispatch({ type: "FINISH_CLOSE" }), animationMs);
    return () => clearTimeout(t);
  }, [s.state, animationMs]);

  // Drives Resolve / Reject when pending and in confirming/canceling.
  useEffect(() => {
    if (s.pendingResult.kind !== "in-flight") return;
    if (s.state !== "confirming" && s.state !== "canceling") return;
    let cancelled = false;
    const p = new Promise<"ok" | "failed">((resolve) => {
      setTimeout(() => resolve(s.state === "confirming" ? "ok" : "failed"), confirmDelayMs);
    });
    p.then((result) => {
      if (cancelled) return;
      if (result === "ok") dispatch({ type: "RESOLVE" });
      else dispatch({ type: "REJECT" });
    });
    return () => {
      cancelled = true;
    };
  }, [s.state, s.pendingResult, confirmDelayMs]);

  return (
    <div data-testid="dialog-root" data-state={s.state}>
      {s.state === "closed" && (
        <button data-testid="open-button" onClick={() => dispatch({ type: "OPEN" })}>
          Open dialog
        </button>
      )}

      {(s.state === "opening" ||
        s.state === "open" ||
        s.state === "confirming" ||
        s.state === "canceling" ||
        s.state === "error") && (
        <div role="dialog" aria-modal="true" data-testid="dialog-panel">
          {s.state === "open" && (
            <>
              <button
                data-testid="confirm-button"
                onClick={() => dispatch({ type: "CONFIRM" })}
              >
                Confirm
              </button>
              <button
                data-testid="cancel-button"
                onClick={() => dispatch({ type: "CANCEL" })}
              >
                Cancel
              </button>
              <button
                data-testid="dismiss-button"
                onClick={() => dispatch({ type: "DISMISS" })}
              >
                Dismiss
              </button>
            </>
          )}

          {(s.state === "confirming" || s.state === "canceling") && (
            <p data-testid="pending-message">Working...</p>
          )}

          {s.state === "error" && (
            <>
              <p data-testid="error-message">Something went wrong.</p>
              <button
                data-testid="retry-button"
                onClick={() => dispatch({ type: "RETRY" })}
              >
                Retry
              </button>
              <button
                data-testid="error-dismiss-button"
                onClick={() => dispatch({ type: "ERROR_DISMISS" })}
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Re-export for tests
export type { DialogState, DialogStateShape };
export { initialState };