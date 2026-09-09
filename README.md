# RepoSeal — Intelligent Contract

RepoSeal is a GenLayer Intelligent Contract that verifies whether an exact
public GitHub commit follows its declared open-source license and direct-
dependency policy. Validators inspect live repository files, package-registry
metadata, and official SPDX requirements; independently apply the same rubric;
and store an auditable verdict on-chain.

> **Submission scope:** this repository is intentionally contract-focused. It
> contains only the Intelligent Contract, contract tests, documentation,
> examples, deployment records/scripts, and contract tooling. It does not
> contain frontend source, wallet code, hosted assets, or a built DApp bundle.

## Why GenLayer is essential

A conventional blockchain can store a claim but cannot retrieve a repository
tree, read license and README language, inspect dependency metadata, or decide
whether incomplete evidence supports a reliable conclusion. RepoSeal uses
GenLayer's native web and LLM capabilities inside an Equivalence Principle so
the result is accepted only after independent validator evaluation.

## What the contract verifies

- The supplied commit exists and its GitHub tree is reachable.
- A root `LICENSE`, `COPYING`, or equivalent file is present.
- The file materially matches the declared license and official SPDX data.
- README attribution and notice obligations appear satisfied.
- Supported root package manifests and lockfiles are inspected.
- Public npm/PyPI metadata identifies direct dependency licenses.
- No reliable evidence violates the caller's declared dependency rule.

Missing, contradictory, or unavailable material evidence yields
`INCONCLUSIVE`; it is never treated as proof of compliance or violation.

## Public methods

| Method | Type | Purpose |
| --- | --- | --- |
| `create_verification(repo_url, commit_hash, declared_license, dependency_rule)` | write | Create a record pinned to a GitHub commit and explicit policy. |
| `analyze_repository(verification_id)` | write | Gather live evidence and store a consensus verdict. |
| `recheck_new_commit(verification_id, new_commit_hash)` | write | Run fresh consensus for a different commit in the same record. |
| `get_verification(verification_id)` | view | Read the complete stored record. |
| `get_verification_ids()` | view | Enumerate record IDs. |
| `get_verification_count()` | view | Read the record count. |

Each completed analysis stores `COMPLIANT`, `NON_COMPLIANT`, or
`INCONCLUSIVE`, plus score, reason, findings, evidence URLs, commit hash,
creator, timestamps, and recheck count. Only the creator may analyze or
recheck that record; reads are public.

## Consensus design

The leader fetches a bounded evidence bundle and returns structured JSON. Each
validator independently repeats retrieval and analysis. A validator accepts
only the same verdict with a score difference no greater than 18 points.
Malformed output, conflicting verdicts, or excessive score divergence is
rejected under the Equivalence Principle.

Repository and registry text is explicitly treated as untrusted evidence, not
instructions. Web responses, selected files, dependency reports, model output,
and stored evidence are all size-bounded.

## Contract-only repository layout

```text
contracts/                 Intelligent Contract source
tests/direct/              Deterministic and mocked-consensus tests
docs/                      Architecture and security documentation
examples/                  Studio call examples
deployments/               Finalized network evidence
scripts/                   Contract check and deployment helpers
.github/workflows/         Contract-only CI
```

## Local verification

Python 3.12 or later is required.

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
pytest -q
genvm-lint check contracts/reposeal.py
```

The direct suite covers record creation and reads, all three verdicts,
creator-only writes, malformed inputs, recheck protection, and fresh-commit
state transitions.

## Studionet deployment

- Network: GenLayer Studionet (`61999`, `GEN`)
- Contract: `0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F`
- [Contract explorer](https://explorer-studio.genlayer.com/address/0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F)
- [Finalized deployment transaction](https://explorer-studio.genlayer.com/tx/0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8)

### Finalized full-consensus proof

- Record: `verify-1`
- Rechecked commit: `7e36fef83d10eb9452fefd7d9aabd253f46766fd`
- [Create transaction](https://explorer-studio.genlayer.com/tx/0x6313953207e44d81f593c9b91fa35c187c70aa77f59683ff53979fbf0a764a33)
- [Analysis transaction](https://explorer-studio.genlayer.com/tx/0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296)
- [Recheck transaction](https://explorer-studio.genlayer.com/tx/0xbce2d71d411a295725a8f8e412d58cdd6022f92b9e5a39a8da5aed0f7538a0db)
- Stored result: `INCONCLUSIVE`, score `55/100`, recheck count `1`
- Checked: `2026-09-06T16:53:41Z`

The finalized result demonstrates fail-closed behavior: validators verified the
new commit and MIT license but could not resolve three Git-form Python
dependencies through PyPI, so they correctly withheld a `COMPLIANT` claim.
This is a completed consensus verdict, not a pending analysis.

## Optional external demo

The separately hosted [public RepoSeal DApp](https://reposeal.amzar1st96.chatgpt.site)
can read `verify-1` without a wallet and submit creator-authorized writes through
MetaMask. The DApp is supporting demo infrastructure and is intentionally not
included in this Intelligent Contract repository.

## Scope

RepoSeal currently checks public GitHub evidence, supported root manifests, and
up to 12 direct dependencies. It is a source-grounded compliance signal, not a
complete transitive software-composition analysis or legal advice. See
[`docs/SECURITY.md`](docs/SECURITY.md).

## License

MIT. See [`LICENSE`](LICENSE).
