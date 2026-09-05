# RepoSeal Studio test plan

## Deployment

- Deploy with no constructor arguments.
- Confirm the contract schema exposes `create_verification`, `analyze_repository`, `get_verification`, `recheck_new_commit`, `get_verification_ids`, and `get_verification_count`.

## Deterministic validation

- Reject non-GitHub URLs.
- Reject malformed or non-hex commit hashes.
- Reject empty license and dependency policies.
- Reject duplicate recheck hashes.
- Reject analysis and recheck calls from a wallet other than the record creator.

## Consensus branches

- A repository with an exact reachable commit, matching license file, README attribution, and permitted dependencies should return `COMPLIANT`.
- A repository with direct evidence of a material license or dependency-rule violation should return `NON_COMPLIANT`.
- Missing/unavailable license, registry, or commit evidence should return `INCONCLUSIVE` when the rubric cannot support a reliable conclusion.
- Conflicting validator judgments should leave application state unchanged under the Equivalence Principle.

## Replay and recheck

- Re-running `analyze_repository` on an existing final record is permitted and replaces the prior analysis with a new consensus result.
- `recheck_new_commit` must store the new SHA and produce a fresh consensus result in one transaction.
- Evidence URLs must correspond to the exact checked commit and official/registry sources fetched during that run.

## Wallet workflow

- Use two independent wallets: creator can create/analyze/recheck; another wallet cannot mutate the record.
- Public reads work without a wallet.
- MetaMask must be switched to Studionet chain ID `61999` before signing.
