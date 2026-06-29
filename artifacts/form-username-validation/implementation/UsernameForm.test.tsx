import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UsernameForm } from "./UsernameForm";
import type { CheckFn } from "./formReducer";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe("UsernameForm — component", () => {
  it("renders the idle message", () => {
    render(<UsernameForm check={async () => ({ kind: "available" })} />);
    expect(screen.getByText("Pick a username.")).toBeInTheDocument();
  });

  it("moves to 'Checking…' after typing", async () => {
    const check: CheckFn = async () => {
      await sleep(50);
      return { kind: "available" };
    };
    render(<UsernameForm check={check} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "alice" } });
    expect(screen.getByText("Checking…")).toBeInTheDocument();
    await waitFor(() => screen.getByText("Available."));
  });

  it("shows 'Username is already taken' when check returns taken", async () => {
    const check: CheckFn = async () => ({ kind: "taken" });
    render(<UsernameForm check={check} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "bob" } });
    await waitFor(() =>
      expect(
        screen.getByText("Username is already taken."),
      ).toBeInTheDocument(),
    );
  });

  it("editing the input after 'taken' moves back to Checking…", async () => {
    const check: CheckFn = async (input) =>
      input === "alice" ? { kind: "available" } : { kind: "taken" };
    render(<UsernameForm check={check} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "bob" } });
    await waitFor(() =>
      expect(
        screen.getByText("Username is already taken."),
      ).toBeInTheDocument(),
    );
    fireEvent.change(input, { target: { value: "alice" } });
    expect(screen.getByText("Checking…")).toBeInTheDocument();
    await waitFor(() => screen.getByText("Available."));
  });
});