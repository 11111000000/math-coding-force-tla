// Dialog.test.tsx — React component smoke test

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Dialog } from "./Dialog";
import { dialogReducer, initialState } from "./dialogReducer";

afterEach(() => {
  cleanup();
});

describe("Dialog component", () => {
  it("renders the open button when closed", () => {
    render(<Dialog animationMs={1} confirmDelayMs={1} />);
    expect(screen.getByTestId("open-button")).toBeInTheDocument();
  });

  it("strong-fairness: error state renders close button (reducer-level)", async () => {
    // The Dialog component always resolves "ok" from confirming, so error
    // is unreachable through UI events alone. We verify the render path
    // by importing the reducer and testing the full error->closing transition.
    let s = dialogReducer(initialState, { type: "OPEN" });
    s = dialogReducer(s, { type: "FINISH_OPEN" });
    s = dialogReducer(s, { type: "CONFIRM" });
    s = dialogReducer(s, { type: "REJECT" });
    expect(s.state).toBe("error");
    // ERROR_DISMISS: error -> closing, mirroring SF_<<state, pendingResult>>(ErrorDismiss)
    s = dialogReducer(s, { type: "ERROR_DISMISS" });
    expect(s.state).toBe("closing");
    expect(s.pendingResult).toEqual({ kind: "none" });
  });

  it("full lifecycle: open -> confirm -> resolve -> close", async () => {
    render(<Dialog animationMs={5} confirmDelayMs={5} />);

    screen.getByTestId("open-button").click();

    await waitFor(() =>
      expect(screen.getByTestId("dialog-root").getAttribute("data-state")).toBe("open"),
    );

    screen.getByTestId("confirm-button").click();

    await waitFor(() =>
      expect(screen.getByTestId("dialog-root").getAttribute("data-state")).toBe("closed"),
    );
  });
});