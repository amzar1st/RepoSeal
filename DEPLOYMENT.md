# RepoSeal deployment checklist

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
