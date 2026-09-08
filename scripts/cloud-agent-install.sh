#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_BIN="${HOME}/.local/bin"

ensure_path() {
  if ! grep -qs 'export PATH="$HOME/.local/bin:$PATH"' "${HOME}/.bashrc"; then
    printf '\n# Codex CLI and user-local binaries\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "${HOME}/.bashrc"
  fi
  export PATH="${LOCAL_BIN}:${PATH}"
}

install_codex() {
  mkdir -p "${LOCAL_BIN}"
  npm install -g @openai/codex --prefix "${HOME}/.local"
  codex --version
}

install_python_backend() {
  if ! dpkg -s python3.12-venv >/dev/null 2>&1; then
    sudo apt-get update -qq
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq python3.12-venv
  fi

  cd "${ROOT_DIR}/services/api"
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
}

install_node_workspace() {
  cd "${ROOT_DIR}"
  npm ci
}

ensure_path
install_codex
install_node_workspace
install_python_backend
