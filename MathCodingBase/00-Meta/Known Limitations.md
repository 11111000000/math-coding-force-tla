# Known Limitations

Four blind spots the methodology names but does not solve. Each one is a
boundary between what artifacts can guarantee and what humans must guarantee.

The methodology earns trust by naming these limits on the record. The
[`Mechanical Verification Model`](../03-Architecture/Mechanical Verification Model.md)
document already admits the first three in passing; this file makes them
explicit, gives them stable ids, and tracks the mitigation in place plus
the residual risk. Cross-link from
[`Self Justification`](../04-Fractal-Self/Self%20Justification.md).

The limits are not flaws to engineer away. They are the seam between
mechanical verification and human responsibility. Every L2 / L3 packet
that ships under MathCoding sits on this seam.

---

## L1 — The agent sits between the tool exit and the verification write

**Statement.** `bin/verify` invokes SANY and TLC, captures their exit
codes, and writes `verification.json`. Between the tool exit and the file
write, an agent runs Python code that formats the output and decides
which fields to populate. That decision is text interpretation, not
mechanical reasoning.

**Mitigation in place.**

- The `verdict` field is a closed enum. A mistyped verdict fails schema
  validation; a hidden verdict makes the artifact visibly incomplete.
- `bin/verify` is the only sanctioned writer of `verification.json` for
  `VERIFIED` and `NEEDS_REVISION`.
- For `UNVERIFIABLE:*` the agent writes the file itself, but the
  `human_review` block records who picks up the obligation.

**Residual risk.** A buggy or adversarial agent could edit
`verification.json` between the tool exit and the disk write, or could
ship a packet whose `bin/verify` invocation passes by accident on a
different artifact than the one declared in `Model.tla`. Filesystem
integrity is outside the methodology's perimeter.

---

## L2 — Human-in-the-loop is not formalized

**Statement.** When a packet declares `UNVERIFIABLE:*`, the contract asks
for a named reviewer, a process, a trigger, and an optional
re-verification path. The methodology records the obligation. It does
not verify that the named reviewer actually ran the review.

**Mitigation in place.**

- The `UNVERIFIABLE:*` subtypes — `TOOL_MISSING`, `OUT_OF_SCOPE`,
  `DEFERRED` — each carry a distinct compensation contract. A packet
  without a populated `human_review` block fails `bin/validate-packet`.
- The methodology names unverifiability as a real obligation rather than
  a polite suggestion.

**Residual risk.** "Human review" can degrade into a rubber-stamp if the
named reviewer is not empowered, the trigger never fires, or the process
is not auditable. The methodology hands off to social process at this
seam and cannot observe beyond it.

---

## L3 — Assumption changes do not invalidate the verdict automatically

**Statement.** A packet's `verification.json` records the verdict at the
moment of verification. If the contents of `assumptions.yaml` change
afterwards — a developer promotes an `agent-inferred` assumption to
`user-confirmed`, or opens a previously `user-confirmed` one — the
verdict in `verification.json` does not change with it. The structural
contract still says the model passed; the semantic contract may not.

**Mitigation in place.**

- The Assumption Protocol requires every assumption to carry a status.
- The Verification Evidence Protocol lists invariants, temporal
  properties, and the verdict in the same artifact, so changes are
  diff-visible.

**Residual risk.** A change to `assumptions.yaml` is not coupled to a
required re-run of `bin/verify`. The roadmap item 1.2
(`protocol-strengthening`) is the planned fix: hash `assumptions.yaml`
into `verification.json` and have `bin/validate-packet` reject a packet
whose assumptions have drifted from the verdict. That fix is not
shipped yet.

---

## L4 — Refinement is minimal by design and is not validated

**Statement.** Every packet must carry `refinement.md`. The Refinement
Protocol requires five sections — state mapping, operation mapping,
invariant preservation, test obligation mapping, runtime-check mapping.
There is no mechanical check that `refinement.md` actually says
anything. A file full of `TODO` placeholders passes `bin/validate-packet`
today.

**Mitigation in place.**

- The Refinement Protocol enumerates the required sections, so an empty
  file or a file missing sections is detectable by inspection.
- Traceability Protocol requires every model element to point at a code
  location, so omissions surface there.

**Residual risk.** "Style-guide validated" is weaker than "mechanically
validated". A discipline that lets `refinement.md` carry TODOs is a
discipline on trust. The roadmap item 1.2 closes this gap: hash and
cross-link the refinement to the model's action set, and refuse packets
whose refinement omits operations declared in `Model.tla`. That fix is
not shipped yet.

---

## How to use this document

When reviewing a packet that has shipped under the methodology:

1. Read the verdict in `verification.json`.
2. Walk through L1–L4 above and ask: does this packet actually clear
   each limit, or does it rely on a mitigation that has not fired yet?
3. If a packet depends on a mitigation that does not yet exist (L3 and
   L4 today), treat the verdict as a snapshot, not a permanent
   guarantee. Re-run `bin/verify` after any change to the affected
   artifacts.
4. If you find a limit that this document does not cover, add it. The
   list is not closed; it is a snapshot of what the methodology can
   see about itself right now.

The boundary of trust is mechanical for `VERIFIED` and `NEEDS_REVISION`
verdicts, social for `UNVERIFIABLE:*` verdicts, and absent for the
mitigations that roadmap items 1.2 and 1.3 are about to install.