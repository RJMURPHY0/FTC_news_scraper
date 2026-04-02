# Project Constitution

## Data Schemas
(To be defined in gemini.md)

## Behavioral Rules
(To be defined after discovery)

## Architectural Invariants
- 3-Layer Architecture (A.N.T.)
- LLM logic is probabilistic; business logic is deterministic
- Python scripts in `tools/` must be atomic and testable
- System must follow self-annealing loop on error
