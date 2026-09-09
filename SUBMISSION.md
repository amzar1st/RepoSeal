# RepoSeal submission

## Contribution type

**Builder → Intelligent Contracts**

This repository is the standalone Intelligent Contract contribution. Its
current tree contains only the contract and the permitted contract tests,
documentation, examples, deployment scripts/records, and contract tooling.
It intentionally excludes frontend source, wallet code, built assets, and
hosting configuration.

## Title

RepoSeal — Decentralized Open-Source Compliance Verification

## Description (under 1,000 characters)

RepoSeal is a GenLayer Intelligent Contract that checks whether an exact public
GitHub commit follows its declared open-source license and direct-dependency
policy. Validators independently retrieve commit and tree data, license and
README files, package manifests, npm/PyPI license metadata, and official SPDX
requirements. A leader proposes a structured judgment; validators repeat the
analysis and accept only the same verdict with bounded score variance. The
contract stores COMPLIANT, NON_COMPLIANT, or INCONCLUSIVE with its score,
reason, findings, evidence URLs, commit hash, creator, and timestamps. Missing
material evidence fails closed to INCONCLUSIVE. Creator-only analyze/recheck
writes, exact commit pinning, bounded inputs, prompt-injection defenses, six
public methods, direct-mode tests, CI, deployment records, and finalized
Studionet transactions are included.

## Core evidence

- Repository: https://github.com/amzar1st/RepoSeal
- Contract source: https://github.com/amzar1st/RepoSeal/blob/main/contracts/reposeal.py
- Direct tests: https://github.com/amzar1st/RepoSeal/tree/main/tests/direct
- Deployment: https://explorer-studio.genlayer.com/tx/0xb49189cd819dabe1fea5a1b13932556b506014f3b0b40c8488c10cca6c7f47a8
- Contract: https://explorer-studio.genlayer.com/address/0xD5a60c99d1ddBc2091ae08eC0fAeEe068670C92F
- Analyze: https://explorer-studio.genlayer.com/tx/0x433261a40f97221c06f3bc28962a77d74aef5e8afe69d90451b1c04331d8b296
- Recheck: https://explorer-studio.genlayer.com/tx/0xbce2d71d411a295725a8f8e412d58cdd6022f92b9e5a39a8da5aed0f7538a0db

## Supporting demo (not repository scope)

- Public DApp: https://reposeal.amzar1st96.chatgpt.site
