# RepoSeal

RepoSeal is a GenLayer Intelligent Contract for decentralized open-source compliance verification. A user pins a public GitHub repository to an exact commit, declares the repository license and dependency rule, and asks the contract to analyze public evidence through validator consensus.

## What is verified

- The exact commit exists and its tree is reachable.
- `LICENSE`, `COPYING`, or equivalent license evidence.
- README attribution and notice language.
- Package manifests and lockfiles.
- Direct dependency license metadata where a public registry exposes it.
- The official SPDX license record for the declared license.

The contract returns `COMPLIANT`, `NON_COMPLIANT`, or `INCONCLUSIVE`. Missing evidence is not treated as proof of a violation.

## Intelligent Contract

`contracts/reposeal.py` exposes:

- `create_verification(repo_url, commit_hash, declared_license, dependency_rule)`
- `analyze_repository(verification_id)`
- `get_verification(verification_id)`
- `get_verification_ids()`
- `get_verification_count()`
- `recheck_new_commit(verification_id, new_commit_hash)`

`analyze_repository` uses a leader/validator pattern. Each side independently fetches GitHub, package-registry, and SPDX evidence, then interprets the same rubric. Only the consensus-approved result is stored on-chain.

## Frontend

The static DApp in `frontend/` is bundled into `dist/`. It uses GenLayerJS, connects an EIP-1193 wallet such as MetaMask to Studionet, reads finalized records publicly, and submits signed writes.

```bash
npm install
npm run build
```

Open `dist/index.html` from a static host. Enter the deployed contract address once, connect MetaMask to Studionet, and use the console.

## Local contract validation

```bash
python -m pip install -r requirements.txt
genvm-lint check contracts/reposeal.py
pytest -q
```

For full validator execution against a hosted Studio environment:

```bash
gltest --network studionet tests/integration/ -v -s
```

See `STUDIO_TEST_PLAN.md` and `DEPLOYMENT.md` for the deployment and evidence workflow.

## Network

RepoSeal targets GenLayer Studionet: chain ID `61999`, native token `GEN`, RPC `https://studio.genlayer.com/api`.

## License

MIT. See `LICENSE`.
