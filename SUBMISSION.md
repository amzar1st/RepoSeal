# RepoSeal submission summary

## Project

RepoSeal — Decentralized Open-Source Compliance Verification.

## Use case

Open-source consumers, maintainers, and security teams need a durable answer to a practical question: did a specific repository commit follow its declared license and dependency rules? A static website or ordinary smart contract can store a claim, but cannot independently read repository files, package registries, and license obligations.

## GenLayer role

The RepoSeal Intelligent Contract independently fetches public GitHub commit metadata, repository trees, license/README/package files, dependency registry records, and official SPDX license data. Leader and validators each run the same source-grounded analysis. Consensus approves the verdict before it is stored on-chain.

## Output

Each verification stores the creator, repository URL, exact commit hash, declared license, dependency rule, timestamp, verdict (`COMPLIANT`, `NON_COMPLIANT`, or `INCONCLUSIVE`), score, explanation, findings, and evidence URLs. A newer commit can be rechecked against the same record.

## App

The browser DApp connects MetaMask through EIP-1193 and GenLayerJS on Studionet. It supports public record reads and wallet-signed creation, analysis, and recheck actions.

- Public live DApp: https://reposeal.amzar1st96.chatgpt.site
- Source: https://github.com/amzar1st/RepoSeal
- Deployed contract: `0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F`
- Deployment transaction: https://explorer-studio.genlayer.com/tx/0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8
- Finalized create transaction: https://explorer-studio.genlayer.com/tx/0x6313953207e44d81f593c9b91fa35c187c70aa77f59683ff53979fbf0a764a33
- Finalized analysis transaction: https://explorer-studio.genlayer.com/tx/0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296
- Finalized recheck transaction: https://explorer-studio.genlayer.com/tx/0xbce2d71d411a295725a8f8e412d58cdd6022f92b9e5a39a8da5aed0f7538a0db
- Live record: `verify-1` — commit `7e36fef83d10eb9452fefd7d9aabd253f46766fd`, `INCONCLUSIVE`, score `55/100`, recheck count `1`, checked at `2026-09-06T16:53:41Z`

The live result is intentionally reported exactly as consensus stored it. RepoSeal verified the rechecked commit and MIT license but withheld a `COMPLIANT` claim because three Git-based Python dependency licenses could not be resolved from PyPI. The public DApp preloads this finalized record without a wallet and offers MetaMask-signed create, analysis, and recheck actions.
