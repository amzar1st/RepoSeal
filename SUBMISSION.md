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
