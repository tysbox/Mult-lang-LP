#!/usr/bin/env bash
#
# node_modules をリポジトリ外のキャッシュへ移し、symlink に置き換える。
#
# 目的:
#   依存（数百 MB）をプロジェクト内に置いたままだと、iCloud / Dropbox などの
#   同期対象になった場合に同期容量が膨張し、さらに「別デバイスのユーザー名を
#   含むリンク切れ」が配送されて起動に失敗する。実体をキャッシュへ逃がし、
#   リポジトリ側は symlink だけにすることでこれを避ける。
#
# 使い方:
#   bash scripts/externalize-node-modules.sh --ensure-link  # 冪等（起動時に呼ぶ）
#   bash scripts/externalize-node-modules.sh --restore      # リポジトリ内へ戻す
#   bash scripts/externalize-node-modules.sh                # 初回の外部化
#
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
repo_name="$(basename "$repo_root")"
cache_root="${HOME}/Library/Caches/com.tystudio/${repo_name}"
external_node_modules="${cache_root}/node_modules"
restore_mode="${1:-}"
repo_node_modules="${repo_root}/node_modules"

if [[ "$restore_mode" == "--ensure-link" ]]; then
  if [[ -L "$repo_node_modules" ]]; then
    echo "node_modules link check: OK"
    exit 0
  fi

  if [[ ! -e "$repo_node_modules" && -d "$external_node_modules" ]]; then
    ln -s "$external_node_modules" "$repo_node_modules"
    echo "restored node_modules symlink to $external_node_modules"
    exit 0
  fi

  # node_modules が実ディレクトリ（npm ci 直後 / 同期で実体化した場合）は
  # キャッシュへ移して symlink に置き換える。
  #
  # 注意: キャッシュが既に埋まっているときに実体を捨てると、インストール済みの
  # 依存がすべて消える。実体を移すか、キャッシュ側を正とするかを見分ける。
  if [[ -d "$repo_node_modules" && ! -L "$repo_node_modules" ]]; then
    mkdir -p "$cache_root"
    if [[ -n "$(ls -A "$external_node_modules" 2>/dev/null)" ]]; then
      echo "node_modules link check: cache already populated, keeping cache" >&2
      rm -rf "$repo_node_modules"
      ln -s "$external_node_modules" "$repo_node_modules"
      echo "node_modules symlinked to cache: $external_node_modules"
      exit 0
    fi
    rmdir "$external_node_modules" 2>/dev/null || true
    mv "$repo_node_modules" "$external_node_modules"
    ln -s "$external_node_modules" "$repo_node_modules"
    echo "node_modules symlinked to cache: $external_node_modules"
    exit 0
  fi

  echo "node_modules link check: no repair needed"
  exit 0
fi

if [[ "$restore_mode" == "--restore" ]]; then
  if [[ ! -L "$repo_node_modules" ]]; then
    echo "node_modules is already local"
    exit 0
  fi

  target="$(readlink "$repo_node_modules")"
  rm "$repo_node_modules"

  if [[ -d "$target" ]]; then
    mv "$target" "$repo_node_modules"
    rmdir "${cache_root}" 2>/dev/null || true
    echo "restored node_modules to $repo_node_modules"
    exit 0
  fi

  mkdir -p "$repo_node_modules"
  echo "restored empty node_modules to ${repo_root}/node_modules"
  exit 0
fi

mkdir -p "$cache_root"

if [[ -L "${repo_root}/node_modules" ]]; then
  echo "node_modules already points outside the repo"
  echo "target: $(readlink "${repo_root}/node_modules")"
  exit 0
fi

if [[ -e "$external_node_modules" ]]; then
  echo "external target already exists: $external_node_modules"
  echo "remove it or run 'bash scripts/externalize-node-modules.sh --restore' first"
  exit 1
fi

if [[ -d "${repo_root}/node_modules" ]]; then
  mv "${repo_root}/node_modules" "$external_node_modules"
else
  mkdir -p "$external_node_modules"
fi

ln -s "$external_node_modules" "${repo_root}/node_modules"

echo "node_modules now lives at $external_node_modules"
echo "repo symlink: ${repo_root}/node_modules"
