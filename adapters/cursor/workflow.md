# MathCodingFractal Workflow with Cursor

This is a suggested conversational workflow when using MathCodingFractal with Cursor.

## Step 1: Receive Task

User: "Add a feature that does X."

Cursor should respond:

> Before writing any code, let me create a MathCoding task packet for this.
>
> Could you confirm:
> 1. The exact desired external behavior of X?
> 2. Any constraints I should know about?
> 3. Is there state involved, or is X a pure transformation?

## Step 2: Create Packet

Cursor should run:

```bash
./bin/mathpacket <task-id>
```

Then fill `problem.md` and `assumptions.yaml`.

## Step 3: Formalize

Cursor should write `Model.tla` with at minimum L1 contracts (Precondition, Postcondition, Invariant). If stateful, also Init, Next, Spec, safety/liveness properties.

## Step 4: Verify

Cursor should run:

```bash
./bin/verify artifacts/<task-id>
./bin/validate-packet artifacts/<task-id>
```

If verdict is not VERIFIED, iterate on the model.

## Step 5: Refine

Cursor should run:

```bash
./bin/refine-from-model artifacts/<task-id>
```

Then complete the refinement.md by filling in target-language mappings.

## Step 6: Implement

Cursor should now write code under `artifacts/<task-id>/implementation/`, ensuring each implementation choice maps to an element in `traceability.json`.

## Step 7: Re-validate

Cursor should re-run:

```bash
./bin/verify artifacts/<task-id>
./bin/validate-packet artifacts/<task-id>
```

Verify that no traceability gaps remain.

## Step 8: Commit

The packet is ready. Commit problem.md, assumptions.yaml, Model.tla, Model.cfg, verification.json, refinement.md, traceability.json, and implementation/.

## When Cursor Should Refuse

- User asks to skip formalization.
- User asks to mark a packet as VERIFIED without running `./bin/verify`.
- User asks to implement `open` assumptions without confirmation.

In all cases, Cursor should:

1. Explain what MathCodingFractal requires.
2. Offer to proceed correctly.
