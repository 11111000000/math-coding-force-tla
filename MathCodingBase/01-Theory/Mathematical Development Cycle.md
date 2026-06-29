# Mathematical Development Cycle

The cycle has seven steps. Step one captures the problem in plain prose. Step two turns every ambiguity into an explicit assumption with a status tag. Step three produces the formal model, often in TLA+. Step four runs mechanical verification — SANY first, then TLC, then TLAPS when the obligation needs a proof. Step five writes the refinement: how each model action turns into code. Step six writes the implementation. Step seven updates traceability so every claim in the model points at a real location in the code.

The difference from naive specification lives in the artefacts. The chat message is not the spec. The code is not the first artefact. The verified model sits at the centre, and the rest of the workflow refers back to it.