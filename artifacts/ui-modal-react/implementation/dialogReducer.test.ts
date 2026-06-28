// dialogReducer.test.ts — Vitest. One case per TLA+ action.

import { describe, expect, it } from "vitest";
import {
  initialState,
  dialogReducer,
  assertStateInvariant,
  assertNoPendingIfSettled,
  type DialogAction,
} from "./dialogReducer";

function dispatchSequence(actions: DialogAction[]) {
  let s = initialState;
  for (const a of actions) {
    s = dialogReducer(s, a);
  }
  return s;
}

describe("dialogReducer", () => {
  it("OPEN: closed -> opening", () => {
    const s = dispatchSequence([{ type: "OPEN" }]);
    expect(s.state).toBe("opening");
    expect(s.pendingResult).toEqual({ kind: "none" });
  });

  it("FINISH_OPEN: opening -> open", () => {
    const s = dispatchSequence([{ type: "OPEN" }, { type: "FINISH_OPEN" }]);
    expect(s.state).toBe("open");
  });

  it("CONFIRM: open -> confirming, in-flight", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
    ]);
    expect(s.state).toBe("confirming");
    expect(s.pendingResult).toEqual({ kind: "in-flight" });
  });

  it("CANCEL: open -> canceling, in-flight", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CANCEL" },
    ]);
    expect(s.state).toBe("canceling");
    expect(s.pendingResult).toEqual({ kind: "in-flight" });
  });

  it("DISMISS: open -> canceling (same as CANCEL)", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "DISMISS" },
    ]);
    expect(s.state).toBe("canceling");
    expect(s.pendingResult).toEqual({ kind: "in-flight" });
  });

  it("RESOLVE: confirming -> closing, ok", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "RESOLVE" },
    ]);
    expect(s.state).toBe("closing");
    expect(s.pendingResult).toEqual({ kind: "ok" });
  });

  it("REJECT: confirming -> error, failed", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "REJECT" },
    ]);
    expect(s.state).toBe("error");
    expect(s.pendingResult).toEqual({ kind: "failed" });
  });

  it("FINISH_CLOSE: closing -> closed, none", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "RESOLVE" },
      { type: "FINISH_CLOSE" },
    ]);
    expect(s.state).toBe("closed");
    expect(s.pendingResult).toEqual({ kind: "none" });
  });

  it("RETRY: error -> confirming, in-flight", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "REJECT" },
      { type: "RETRY" },
    ]);
    expect(s.state).toBe("confirming");
    expect(s.pendingResult).toEqual({ kind: "in-flight" });
  });

  it("ERROR_DISMISS: error -> closing, none", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "REJECT" },
      { type: "ERROR_DISMISS" },
    ]);
    expect(s.state).toBe("closing");
    expect(s.pendingResult).toEqual({ kind: "none" });
  });

  it("negative: OPEN from non-closed is a no-op", () => {
    const s = dispatchSequence([{ type: "OPEN" }, { type: "OPEN" }]);
    expect(s.state).toBe("opening");
  });

  it("negative: CONFIRM from error is a no-op", () => {
    const s = dispatchSequence([
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "REJECT" },
      { type: "CONFIRM" },
    ]);
    expect(s.state).toBe("error");
  });

  it("property: random action sequences never produce invalid state", () => {
    const actions: DialogAction[] = [
      { type: "OPEN" },
      { type: "FINISH_OPEN" },
      { type: "CONFIRM" },
      { type: "CANCEL" },
      { type: "DISMISS" },
      { type: "RESOLVE" },
      { type: "REJECT" },
      { type: "FINISH_CLOSE" },
      { type: "RETRY" },
      { type: "ERROR_DISMISS" },
    ];

    let state = initialState;
    for (let i = 0; i < 200; i++) {
      const a = actions[i % actions.length]!;
      state = dialogReducer(state, a);
      assertStateInvariant(state);
      assertNoPendingIfSettled(state);
    }
  });
});