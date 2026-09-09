# RepoSeal Studio test plan

## Deployment and schema

- Deploy with no constructor arguments on stable Studionet.
- Use Normal / Full Consensus.
- Confirm successful execution as well as final transaction status.
- Confirm the schema exposes `create_verification`, `analyze_repository`,
  `get_verification`, `recheck_new_commit`, `get_verification_ids`, and
  `get_verification_count`.

## Deterministic validation

- Reject non-GitHub URLs.
- Reject malformed or non-hex commit hashes.
- Reject empty license and dependency policies.
- Reject duplicate recheck hashes.
- Reject analyze and recheck calls from any account except the record creator.

## Consensus branches

- Reach `COMPLIANT` only when exact commit, license/notice, and dependency
  evidence supports the declared policy.
- Reach `NON_COMPLIANT` only when reliable public evidence shows a material
  license, attribution, notice, or dependency-rule violation.
- Reach `INCONCLUSIVE` when a material source is missing, unavailable,
  contradictory, or insufficient.
- Reject a leader result when a validator disagrees on verdict or differs by
  more than 18 score points.

## Replay and recheck

- Re-running `analyze_repository` on a completed record replaces its prior
  analysis only after fresh consensus.
- `recheck_new_commit` must store the new SHA, increment `recheck_count`, and
  produce fresh evidence in one atomic transaction.
- Evidence URLs must correspond to the checked commit and public sources used
  during that run.

## Authorization and reads

- Use two accounts to prove only the creator can analyze or recheck.
- Confirm every view method works without a signing account.
- Read the finalized record after each write; do not infer execution success
  from accepted/finalized status alone.
