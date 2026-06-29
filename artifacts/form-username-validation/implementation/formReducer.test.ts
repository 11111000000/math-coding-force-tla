import { describe, expect, it } from "vitest";
import {
  formReducer,
  initialState,
  validate,
  type CheckFn,
  type FormState,
} from "./formReducer";

function dispatchOn(state: FormState, action: Parameters<typeof formReducer>[1]) {
  return formReducer(state, action);
}

describe("formReducer — shape", () => {
  it("starts in idle", () => {
    expect(initialState).toEqual({ kind: "idle" });
  });

  it("ON_CHANGE moves to validating with a fresh request id", () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "alice" });
    expect(s.kind).toBe("validating");
    if (s.kind === "validating") {
      expect(s.requestId).toBeGreaterThan(0);
      expect(s.input).toBe("alice");
    }
  });

  it("RESET clears back to idle regardless of prior state", () => {
    const s = formReducer(
      { kind: "validating", requestId: 5, input: "x" },
      { type: "RESET" },
    );
    expect(s).toEqual({ kind: "idle" });
  });
});

describe("formReducer — staleness guard (StalenessInvariant)", () => {
  it("drops RESOLVE_AVAILABLE for a stale request id", () => {
    const s1 = formReducer(initialState, { type: "ON_CHANGE", input: "a" });
    const s2 = formReducer(s1, { type: "ON_CHANGE", input: "ab" });
    // s2 has a newer request id; responding to s1's id must not change state.
    if (s2.kind !== "validating") throw new Error("expected validating");
    const staleId = s1.kind === "validating" ? s1.requestId : 0;
    const after = formReducer(s2, { type: "RESOLVE_AVAILABLE", requestId: staleId });
    expect(after).toEqual(s2);
  });

  it("drops RESOLVE_TAKEN for a stale request id", () => {
    const s1 = formReducer(initialState, { type: "ON_CHANGE", input: "a" });
    const s2 = formReducer(s1, { type: "ON_CHANGE", input: "ab" });
    if (s2.kind !== "validating") throw new Error("expected validating");
    const staleId = s1.kind === "validating" ? s1.requestId : 0;
    const after = formReducer(s2, { type: "RESOLVE_TAKEN", requestId: staleId });
    expect(after).toEqual(s2);
  });
});

describe("formReducer — single-flight guard (SingleFlightInvariant)", () => {
  it("two simultaneous ON_CHANGEs keep only the latest in flight", () => {
    const s1 = formReducer(initialState, { type: "ON_CHANGE", input: "a" });
    const s2 = formReducer(s1, { type: "ON_CHANGE", input: "ab" });
    if (s2.kind !== "validating") throw new Error("expected validating");
    if (s1.kind !== "validating") throw new Error("expected validating");
    expect(s2.requestId).toBeGreaterThan(s1.requestId);
  });

  it("resolving the second (latest) request moves to valid", () => {
    const s1 = formReducer(initialState, { type: "ON_CHANGE", input: "a" });
    const s2 = formReducer(s1, { type: "ON_CHANGE", input: "ab" });
    if (s2.kind !== "validating") throw new Error("expected validating");
    const r = formReducer(s2, { type: "RESOLVE_AVAILABLE", requestId: s2.requestId });
    expect(r).toEqual({
      kind: "valid",
      requestId: s2.requestId,
      input: "ab",
    });
  });
});

describe("formReducer — invalid path", () => {
  it("RESOLVE_INVALID with reason stores the reason", () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const r = formReducer(s, {
      type: "RESOLVE_INVALID",
      requestId: s.requestId,
      reason: "username too short",
    });
    expect(r).toEqual({
      kind: "invalid",
      requestId: s.requestId,
      input: "",
      reason: "username too short",
    });
  });
});

describe("validate() — async helper", () => {
  it("dispatches RESOLVE_AVAILABLE when the check succeeds", async () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "alice" });
    if (s.kind !== "validating") throw new Error("expected validating");

    const dispatched: Parameters<typeof formReducer>[1][] = [];
    const check: CheckFn = async () => ({ kind: "available" });
    await validate(s.requestId, "alice", check, (a) => dispatched.push(a));
    expect(dispatched).toEqual([
      { type: "RESOLVE_AVAILABLE", requestId: s.requestId },
    ]);
  });

  it("dispatches RESOLVE_TAKEN when the check reports taken", async () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "bob" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const dispatched: Parameters<typeof formReducer>[1][] = [];
    const check: CheckFn = async () => ({ kind: "taken" });
    await validate(s.requestId, "bob", check, (a) => dispatched.push(a));
    expect(dispatched).toEqual([
      { type: "RESOLVE_TAKEN", requestId: s.requestId },
    ]);
  });

  it("dispatches RESOLVE_INVALID with reason 'network error' on rejection", async () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "x" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const dispatched: Parameters<typeof formReducer>[1][] = [];
    const check: CheckFn = async () => {
      throw new Error("boom");
    };
    await validate(s.requestId, "x", check, (a) => dispatched.push(a));
    expect(dispatched).toEqual([
      { type: "RESOLVE_INVALID", requestId: s.requestId, reason: "network error" },
    ]);
  });

  it("abort signal prevents dispatch when fired before resolution", async () => {
    const s = formReducer(initialState, { type: "ON_CHANGE", input: "y" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const dispatched: Parameters<typeof formReducer>[1][] = [];
    const ctrl = new AbortController();
    ctrl.abort();
    const check: CheckFn = async () => ({ kind: "available" });
    await validate(s.requestId, "y", check, (a) => dispatched.push(a), ctrl.signal);
    expect(dispatched).toEqual([]);
  });
});

describe("end-to-end — three failure modes from the UI guide", () => {
  it("mode 1: 'taken' badge clears when user edits the input", () => {
    let s = formReducer(initialState, { type: "ON_CHANGE", input: "bob" });
    if (s.kind !== "validating") throw new Error("expected validating");
    s = formReducer(s, { type: "RESOLVE_TAKEN", requestId: s.requestId });
    expect(s.kind).toBe("taken");
    // User edits the input: ON_CHANGE bumps requestId and drops pendingResult.
    s = formReducer(s, { type: "ON_CHANGE", input: "bobby" });
    expect(s.kind).toBe("validating");
  });

  it("mode 2: out-of-order responses do not leak stale 'taken'", () => {
    let s = formReducer(initialState, { type: "ON_CHANGE", input: "alice" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const firstId = s.requestId;
    // User types again before first response arrives.
    s = formReducer(s, { type: "ON_CHANGE", input: "alice2" });
    if (s.kind !== "validating") throw new Error("expected validating");
    const secondId = s.requestId;
    // First response (taken) arrives AFTER second request is in flight.
    const after = formReducer(s, { type: "RESOLVE_TAKEN", requestId: firstId });
    expect(after).toEqual(s);
    // Second response (available) is the one we care about.
    const final = formReducer(s, { type: "RESOLVE_AVAILABLE", requestId: secondId });
    expect(final.kind).toBe("valid");
  });

  it("mode 3: RESET clears the form completely", () => {
    let s = formReducer(initialState, { type: "ON_CHANGE", input: "alice" });
    if (s.kind !== "validating") throw new Error("expected validating");
    s = formReducer(s, { type: "RESOLVE_AVAILABLE", requestId: s.requestId });
    expect(s.kind).toBe("valid");
    s = formReducer(s, { type: "RESET" });
    expect(s).toEqual({ kind: "idle" });
  });
});

describe("sanity — REDUCER.DISPATCH action order", () => {
  it("dispatchOn helper works (silences unused warning)", () => {
    const s = dispatchOn(initialState, { type: "RESET" });
    expect(s).toEqual({ kind: "idle" });
  });
});