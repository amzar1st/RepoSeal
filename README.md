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

Open `dist/index.html` from a static host, connect MetaMask to Studionet, and use the console. The production Studionet contract address is preconfigured and can still be replaced from the console when testing another deployment.

Public live DApp: https://reposeal.amzar1st96.chatgpt.site

The page preloads finalized record `verify-1` without requiring a wallet. MetaMask is required only for signed create, analyze, and recheck transactions.

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

- Contract: `0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F`
- Deployment transaction: `0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8`
- Explorer: https://explorer-studio.genlayer.com/address/0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F

## Finalized live verification

- Verification ID: `verify-1`
- Initial repository commit: `ab4dbd9f85b03cb7f2e7da1ada9ef28b822a9e9b`
- Rechecked repository commit: `7e36fef83d10eb9452fefd7d9aabd253f46766fd`
- Create transaction: `0x6313953207e44d81f593c9b91fa35c187c70aa77f59683ff53979fbf0a764a33`
- Analysis transaction: `0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296`
- Recheck transaction: `0xbce2d71d411a295725a8f8e412d58cdd6022f92b9e5a39a8da5aed0f7538a0db`
- Consensus verdict: `INCONCLUSIVE` (`55/100`)
- Recheck count: `1`
- Last checked: `2026-09-06T16:53:41Z`

The finalized recheck demonstrates the contract's fail-closed behavior: the new exact commit and MIT license were verified, but three Git-based Python dependency licenses remained unresolved, so validators did not claim full compliance.

## License

MIT. See `LICENSE`.
