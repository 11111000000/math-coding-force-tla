# Traceability Protocol

Traceability records how assumptions, contracts, states, and properties map into implementation artifacts.

## Traceability Must Link

- assumption -> guard or decision point
- precondition -> validation logic
- invariant -> assertion, type constraint, or test
- postcondition -> test or runtime check
- action -> procedure / method / reducer / transition code

The canonical machine-readable artifact is `traceability.json`.