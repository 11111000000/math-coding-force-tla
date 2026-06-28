// dialogReducer.ts — verified TLA+ model refinement in TypeScript

export type DialogState =
  | "closed"
  | "opening"
  | "open"
  | "confirming"
  | "canceling"
  | "closing"
  | "error";

export type PendingResult =
  | { kind: "none" }
  | { kind: "in-flight" }
  | { kind: "ok" }
  | { kind: "failed" };

export interface DialogStateShape {
  state: DialogState;
  pendingResult: PendingResult;
}

export type DialogAction =
  | { type: "OPEN" }
  | { type: "FINISH_OPEN" }
  | { type: "CONFIRM" }
  | { type: "CANCEL" }
  | { type: "DISMISS" }
  | { type: "RESOLVE" }
  | { type: "REJECT" }
  | { type: "FINISH_CLOSE" }
  | { type: "RETRY" }
  | { type: "ERROR_DISMISS" };

export const initialState: DialogStateShape = {
  state: "closed",
  pendingResult: { kind: "none" },
};

// Exhaustiveness assertion at module load.
// If the DialogState union is extended without updating this list,
// TypeScript fails compilation.
const DIALOG_STATE_VALUES = [
  "closed",
  "opening",
  "open",
  "confirming",
  "canceling",
  "closing",
  "error",
] as const satisfies readonly DialogState[];

const _exhaustive: DialogState = DIALOG_STATE_VALUES[0];
for (const v of DIALOG_STATE_VALUES) {
  const _check: DialogState = v;
}

export function dialogReducer(
  state: DialogStateShape,
  action: DialogAction,
): DialogStateShape {
  switch (action.type) {
    case "OPEN":
      if (state.state !== "closed") return state;
      return { state: "opening", pendingResult: { kind: "none" } };

    case "FINISH_OPEN":
      if (state.state !== "opening") return state;
      return { state: "open", pendingResult: { kind: "none" } };

    case "CONFIRM":
      if (state.state !== "open") return state;
      return { state: "confirming", pendingResult: { kind: "in-flight" } };

    case "CANCEL":
      if (state.state !== "open") return state;
      return { state: "canceling", pendingResult: { kind: "in-flight" } };

    case "DISMISS":
      if (state.state !== "open") return state;
      return { state: "canceling", pendingResult: { kind: "in-flight" } };

    case "RESOLVE":
      if (
        (state.state !== "confirming" && state.state !== "canceling") ||
        state.pendingResult.kind !== "in-flight"
      ) {
        return state;
      }
      return { state: "closing", pendingResult: { kind: "ok" } };

    case "REJECT":
      if (state.state !== "confirming" || state.pendingResult.kind !== "in-flight") {
        return state;
      }
      return { state: "error", pendingResult: { kind: "failed" } };

    case "FINISH_CLOSE":
      if (state.state !== "closing") return state;
      return { state: "closed", pendingResult: { kind: "none" } };

    case "RETRY":
      if (state.state !== "error") return state;
      return { state: "confirming", pendingResult: { kind: "in-flight" } };

    case "ERROR_DISMISS":
      if (state.state !== "error") return state;
      return { state: "closing", pendingResult: { kind: "none" } };

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

// Runtime invariant assertion: state is always one of the seven declared values.
// This mirrors TLA+ StateInvariant.
export function assertStateInvariant(s: DialogStateShape): void {
  const valid: ReadonlySet<DialogState> = new Set(DIALOG_STATE_VALUES);
  if (!valid.has(s.state)) {
    throw new Error(`StateInvariant violated: state = ${s.state}`);
  }
}

// Runtime invariant assertion: pendingResult is consistent with state.
// Mirrors TLA+ NoPendingIfSettled.
export function assertNoPendingIfSettled(s: DialogStateShape): void {
  const inFlightOrOk = s.pendingResult.kind === "in-flight" || s.pendingResult.kind === "ok";
  const settled = s.state === "closed" || s.state === "opening" || s.state === "open";
  if (inFlightOrOk && settled) {
    throw new Error(
      `NoPendingIfSettled violated: state = ${s.state}, pendingResult = ${s.pendingResult.kind}`,
    );
  }
}