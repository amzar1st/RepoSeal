#!/usr/bin/env bash
set -euo pipefail

python -m pytest -q
genvm-lint check contracts/reposeal.py
