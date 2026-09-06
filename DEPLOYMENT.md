# RepoSeal deployment checklist

## Current Studionet deployment

- Status: `FINALIZED`
- Consensus mode: `Normal (Full Consensus)`
- Contract: `0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F`
- Transaction: `0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8`
- Original smoke test: `get_verification_count()` returned `0` from accepted state.
- Contract explorer: https://explorer-studio.genlayer.com/address/0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F
- Transaction explorer: https://explorer-studio.genlayer.com/tx/0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8

## Completed full-consensus verification

- Verification ID: `verify-1`
- Repository: `https://github.com/amzar1st/RepoSeal`
- Commit: `ab4dbd9f85b03cb7f2e7da1ada9ef28b822a9e9b`
- Create transaction: `0x6313953207e44d81f593c9b91fa35c187c70aa77f59683ff53979fbf0a764a33` (`FINALIZED`)
- Analyze transaction: `0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296` (`FINALIZED`)
- Stored verdict: `INCONCLUSIVE`
- Score: `55/100`
- Checked at: `2026-09-06T16:32:48Z`

The validators verified the pinned commit, an exact MIT license match, the README, and compatible license metadata for the resolvable npm/PyPI dependencies. They returned `INCONCLUSIVE` because the registry requests generated for `genlayer-py`, `genlayer-test`, and `genvm-linter` Git dependencies returned `404`, preventing all direct dependency licenses from being identified. This is a completed verdict, not a pending or smoke-test-only claim.

## Contract

1. Open GenLayer Studio and select the stable **Studionet** network.
2. Deploy `contracts/reposeal.py` with no constructor arguments.
3. Confirm deployment execution is successful, not only accepted/finalized.
4. Save the contract address in `deployments/studionet.json` and in the RepoSeal website console.
5. Keep the deployment transaction hash and explorer URL in the same deployment record.

The stable Studionet configuration is chain ID `61999` and native token `GEN`. The network-specific explorer is `https://explorer-studio.genlayer.com`.

## First end-to-end run

Use a public repository and an exact 40-character commit SHA.

1. Connect MetaMask to Studionet.
2. Call `create_verification` with a declared license and an explicit dependency policy.
3. Wait for the transaction to finalize and record the returned ID (`verify-1`, etc.).
4. Call `get_verification` to confirm the record is `CREATED`.
5. Call `analyze_repository` from the same creator wallet.
6. Wait for the consensus transaction to finalize.
7. Call `get_verification` again and record the verdict, reason, commit hash, evidence URLs, score, and timestamp.
8. Call `recheck_new_commit` with a different exact SHA and confirm the old result is cleared before the new consensus result is stored.

Do not claim a successful analysis from a transaction status alone. The execution result must show a returned value/successful contract execution.
