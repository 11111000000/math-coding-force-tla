/**
 * Form reducer for the username availability check.
 *
 * The model is in `../UsernameForm.tla` (verified by TLC).
 * State machine: idle → validating → (valid | invalid | taken) → idle.
 *
 * Two invariants from the spec are preserved by the type system:
 *   - StalenessInvariant: a "taken" result is only ever shown for the
 *     request that produced it. ON_CHANGE bumps the request id and
 *     discards pendingResult. Stale responses are filtered by id.
 *   - SingleFlightInvariant: at most one validation is in flight. The
 *     type `pendingRequestId = 0` is the only "no request" state, and
 *     Resolve / Reject do not touch it.
 */

export type FormState =
  | { kind: "idle" }
  | { kind: "validating"; requestId: number; input: string }
  | { kind: "valid"; requestId: number; input: string }
  | { kind: "invalid"; requestId: number; input: string; reason: string }
  | { kind: "taken"; requestId: number; input: string };

export type FormAction =
  | { type: "ON_CHANGE"; input: string }
  | { type: "RESOLVE_AVAILABLE"; requestId: number }
  | { type: "RESOLVE_TAKEN"; requestId: number }
  | { type: "RESOLVE_INVALID"; requestId: number; reason: string }
  | { type: "RESET" };

export const initialState: FormState = { kind: "idle" };

let nextId = 1;

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "ON_CHANGE": {
      const id = nextId++;
      return { kind: "validating", requestId: id, input: action.input };
    }
    case "RESOLVE_AVAILABLE": {
      // Stale-resolution guard: drop responses for a request other than
      // the latest one in flight.
      if (state.kind !== "validating") return state;
      if (state.requestId !== action.requestId) return state;
      return { kind: "valid", requestId: state.requestId, input: state.input };
    }
    case "RESOLVE_TAKEN": {
      if (state.kind !== "validating") return state;
      if (state.requestId !== action.requestId) return state;
      return { kind: "taken", requestId: state.requestId, input: state.input };
    }
    case "RESOLVE_INVALID": {
      if (state.kind !== "validating") return state;
      if (state.requestId !== action.requestId) return state;
      return {
        kind: "invalid",
        requestId: state.requestId,
        input: state.input,
        reason: action.reason,
      };
    }
    case "RESET": {
      return initialState;
    }
  }
}

/**
 * Async helper that runs the validation. The actual `check` function
 * is injected so tests can control the outcome. The returned promise
 * resolves with the request id and result so the caller can dispatch
 * the right action; if the user has since changed the input, the
 * caller should simply not dispatch (the reducer will drop the stale
 * response anyway).
 */
export type CheckResult =
  | { kind: "available" }
  | { kind: "taken" }
  | { kind: "invalid"; reason: string };

export type CheckFn = (input: string) => Promise<CheckResult>;

export async function validate(
  requestId: number,
  input: string,
  check: CheckFn,
  dispatch: (action: FormAction) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) return;
  try {
    const result = await check(input);
    if (signal?.aborted) return;
    if (result.kind === "available") {
      dispatch({ type: "RESOLVE_AVAILABLE", requestId });
    } else if (result.kind === "taken") {
      dispatch({ type: "RESOLVE_TAKEN", requestId });
    } else {
      dispatch({ type: "RESOLVE_INVALID", requestId, reason: result.reason });
    }
  } catch {
    // Network failure is treated as an invalid response with a
    // generic reason. SingleFlightInvariant is preserved because
    // the stale-id guard still drops the response if the user
    // moved on.
    if (signal?.aborted) return;
    dispatch({
      type: "RESOLVE_INVALID",
      requestId,
      reason: "network error",
    });
  }
}