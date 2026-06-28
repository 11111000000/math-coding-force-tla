# Refinement

## State Mapping

- `packetState` in the model maps to the methodology's notion of a packet at a given stage.

## Operation Mapping

- `Advance` maps to a development step that moves a packet to the next required artifact.
- `Complete` maps to the methodology being applied to a change of itself.

## Invariant Preservation Strategy

- Each packet state corresponds to a concrete set of required artifacts under `artifacts/<task-id>/` or `methodology/self-spec/`.

## Test Obligations

- The packet can be validated through `./bin/validate-packet`.
- Mechanical verification is performed through `./bin/verify`.

## Runtime Checks

- L1 contract presence check inside `./bin/verify`.
- Mechanical tool invocation inside the same wrapper.