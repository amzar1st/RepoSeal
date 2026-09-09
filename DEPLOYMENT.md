# RepoSeal deployment evidence

## Current Studionet deployment

- Status: `FINALIZED`
- Consensus mode: `Normal (Full Consensus)`
- Contract: `0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F`
- Deployment transaction: `0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8`
- Deployed: `2026-09-05T18:40:15Z`
- Original read smoke test: `get_verification_count()` returned `0` from accepted state.
- Contract explorer: https://explorer-studio.genlayer.com/address/0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F
- Transaction explorer: https://explorer-studio.genlayer.com/tx/0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8

## Finalized full-consensus analysis

- Verification ID: `verify-1`
- Repository: `https://github.com/amzar1st/RepoSeal`
- Initial commit: `ab4dbd9f85b03cb7f2e7da1ada9ef28b822a9e9b`
- Create transaction: `0x6313953207e44d81f593c9b91fa35c187c70aa77f59683ff53979fbf0a764a33` (`FINALIZED`)
- Analyze transaction: `0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296` (`FINALIZED`)
- Stored verdict: `INCONCLUSIVE`
- Score: `55/100`
- Checked: `2026-09-06T16:32:48Z`

Validators verified the pinned commit, MIT license, README, and compatible
metadata for resolvable dependencies. They returned `INCONCLUSIVE` because
three Git-form Python dependencies were queried as PyPI names and returned
`404`, leaving material license evidence unresolved. This is a completed,
fail-closed verdict.

## Finalized new-commit recheck

- Verification ID: `verify-1`
- New commit: `7e36fef83d10eb9452fefd7d9aabd253f46766fd`
- Recheck transaction: `0xbce2d71d411a295725a8f8e412d58cdd6022f92b9e5a39a8da5aed0f7538a0db` (`FINALIZED`)
- Stored verdict: `INCONCLUSIVE`
- Score: `55/100`
- Recheck count: `1`
- Checked: `2026-09-06T16:53:41Z`

The recheck verified that the new exact commit and tree exist and that license
and README evidence remain consistent with MIT. It retained `INCONCLUSIVE`
because the same three dependency licenses remained unresolved.

## Reproduce the contract checks

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
pytest -q
genvm-lint check contracts/reposeal.py
```

## Deploy from the CLI

```bash
genlayer network set studionet
genlayer network info
genlayer deploy --contract contracts/reposeal.py
```

The constructor takes no arguments. Confirm stable Studionet, chain ID `61999`,
and Normal / Full Consensus before signing.

## Verify any deployment

1. Wait for the deployment to become final.
2. Confirm successful contract execution, not transaction status alone.
3. Verify the six-method schema documented in `README.md`.
4. Call `get_verification_count()` as a read smoke test.
5. Create a record for a public repository and immutable 40-character SHA.
6. Read the returned `verify-N`, then run `analyze_repository` as its creator.
7. After finality, read and record verdict, score, reason, findings, evidence
   URLs, checked commit, and timestamp.
8. Recheck a different commit and verify `recheck_count` increments.

The canonical machine-readable record is `deployments/studionet.json`.
