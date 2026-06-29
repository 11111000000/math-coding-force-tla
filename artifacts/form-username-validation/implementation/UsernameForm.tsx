import { useEffect, useReducer, useRef } from "react";
import {
  formReducer,
  initialState,
  validate,
  type CheckFn,
  type FormState,
} from "./formReducer";

export interface UsernameFormProps {
  check: CheckFn;
  /** Optional: called when the form is in `valid` state. */
  onSubmit?: (input: string) => void;
  /** Optional: extra className for the root <form>. */
  className?: string;
}

export function UsernameForm({ check, onSubmit, className }: UsernameFormProps) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (state.kind !== "validating") {
      abortRef.current?.abort();
      return;
    }
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    validate(state.requestId, state.input, check, dispatch, ctrl.signal);
    return () => ctrl.abort();
  }, [state.kind === "validating" ? state.requestId : null, state.kind === "validating" ? state.input : null, check]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (state.kind === "valid") onSubmit?.(state.input);
      }}
    >
      <label>
        Username
        <input
          type="text"
          value={state.kind === "idle" ? "" : state.input}
          onChange={(e) =>
            dispatch({ type: "ON_CHANGE", input: e.target.value })
          }
          aria-invalid={state.kind === "invalid" || state.kind === "taken"}
        />
      </label>
      <FormStatus state={state} />
      <button type="submit" disabled={state.kind !== "valid"}>
        Submit
      </button>
    </form>
  );
}

function FormStatus({ state }: { state: FormState }) {
  switch (state.kind) {
    case "idle":
      return <p>Pick a username.</p>;
    case "validating":
      return <p>Checking…</p>;
    case "valid":
      return <p style={{ color: "green" }}>Available.</p>;
    case "invalid":
      return <p style={{ color: "red" }}>{state.reason}</p>;
    case "taken":
      return <p style={{ color: "red" }}>Username is already taken.</p>;
  }
}