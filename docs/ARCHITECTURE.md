# Architecture

## State

Each `Verification` is keyed by a monotonic `verify-N` identifier and stores
creator, canonical repository details, commit hash, declared license,
dependency rule, timestamps, recheck count, verdict, score, explanation,
findings, and evidence URLs.

Creation is deterministic. Analysis and recheck enter GenLayer's
non-deterministic execution path and update state atomically only after the
Equivalence Principle accepts the result.

## Evidence pipeline

1. Validate and normalize the GitHub URL, commit hash, license, and policy.
2. Fetch commit metadata and the recursive tree from the GitHub API.
3. Select bounded root license, README, manifest, and lockfile paths.
4. Fetch those files at the pinned commit from `raw.githubusercontent.com`.
5. Resolve up to 12 direct npm/PyPI dependencies through public registries.
6. Fetch the declared license record from SPDX.
7. Give the leader the fixed rubric and bounded evidence bundle.
8. Have validators independently repeat retrieval and analysis.
9. Accept only identical verdicts with score variance of at most 18 points.
10. Store the accepted judgment and evidence URLs.

## Verdict semantics

- `COMPLIANT`: available evidence supports every material requirement.
- `NON_COMPLIANT`: reliable public evidence directly proves a material breach.
- `INCONCLUSIVE`: evidence is missing, unavailable, contradictory, or too weak
  for a reliable conclusion.

Temporary outages and unknown licenses are not converted into violations.

## Bounded execution

RepoSeal limits tree paths to 240, selected files to 10, direct dependency
reports to 12, individual response bodies to 12,000 characters, model reason
and findings lengths, and stored evidence URLs to 9,000 characters.

## Deliberate limits

- Public GitHub repositories only.
- Supported root manifests only.
- Direct dependencies only; no transitive graph expansion.
- Public services can be rate-limited or unavailable.
- The result is a technical compliance signal, not legal advice.
