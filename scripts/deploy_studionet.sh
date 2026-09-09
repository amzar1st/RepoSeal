#!/usr/bin/env bash
set -euo pipefail

genlayer network set studionet
genlayer network info
genlayer deploy --contract contracts/reposeal.py
