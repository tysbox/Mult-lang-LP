#!/usr/bin/env bash
#
# 編集セッションを開始するランチャー。
#
#   - scripts/start-editing.sh : 本体（どのターミナルからでも実行できる）
#   - start.command            : Finder からダブルクリックするための入口（リポジトリ直下）
#
# 手順:
#   1. .nvmrc の Node を解決する（nvm / volta / 既存 の順に探索。見つからなければ取得）
#   2. node_modules を自己修復する（リンク切れ・実体化していても自動で直す）
#   3. Git インデックスを自己修復する（.git/index が欠落していれば再構築）
#   4. 開発サーバーを起動し、応答したら Safari で編集画面と EN サイトを開く
#
# 使い分け:
#   - ターミナルから : npm run edit
#   - Finder から   : start.command をダブルクリック
#
# 環境変数:
#   MA_NO_OPEN=1    … ブラウザを自動で開かない（動作確認用）
#   MA_OPEN_SITE=0  … 編集画面だけを開き、EN サイトは開かない
#   MA_SKIP_GIT=1   … Git インデックスの再構築を行わない
#
# 冪等性:
#   本スクリプトは冪等です。各ステップは「今の状態を検査し、壊れていれば直す」
#   判定のみを行い、正常なら何もしません。デバイスを替えた際に古い状態が
#   残っていても（別デバイスのユーザー名が入った symlink、欠落した Git
#   インデックス、未導入の Node など）、起動のたびに自動で修復されます。
#
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}" || exit 1

HOST="127.0.0.1"
PORT="3000"
BASE_URL="http://${HOST}:${PORT}"
# 編集画面（ダッシュボード）と、編集結果が反映される EN サイト
ADMIN_URL="${BASE_URL}/admin/"
SITE_URL="${BASE_URL}/"

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
info() { printf '  \033[36m•\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$*" >&2; }

bold "=== 編集セッションを開始します ==="
info "作業ディレクトリ: ${REPO_ROOT}"

# ---------------------------------------------------------------------------
# 0) Finder 起動時の PATH 補完
#    Finder から .command を起動すると PATH が最小（/usr/bin:/bin:...）になり、
#    ~/.local/bin や /opt/homebrew/bin が無く node / npm が見つからない。
#    既存のパスを壊さない形で、この端末で node を置いている典型的な場所を足す。
# ---------------------------------------------------------------------------
for _dir in \
  "${HOME}/.local/bin" \
  "${HOME}/.volta/bin" \
  "/opt/homebrew/bin" \
  "/usr/local/bin"
do
  if [ -d "${_dir}" ]; then
    case ":${PATH}:" in
      *":${_dir}:"*) : ;;
      *) PATH="${_dir}:${PATH}" ;;
    esac
  fi
done
export PATH

# ---------------------------------------------------------------------------
# 1) Node.js を .nvmrc に合わせる（nvm → volta → 既存 の順に解決）
#    グローバル設定は一切変更しない。PATH 上で該当バージョンの node を見つけ、
#    見つからなければ取得を試みる。
# ---------------------------------------------------------------------------
export NVM_DIR="${NVM_DIR:-${HOME}/.nvm}"

REQUIRED_NODE=""
[ -f .nvmrc ] && REQUIRED_NODE="$(tr -d '[:space:]' < .nvmrc)"
REQUIRED_NODE="${REQUIRED_NODE#v}"

node_major_minor() {
  # v22.23.3 -> 22.23（engines 相当の判定に使う）
  [ "$1" = '未インストール' ] && return 1
  echo "${1#v}" | cut -d. -f1,2
}

# --- 1-a) nvm があれば読み込み、該当バージョンを有効化する
NVM_ACTIVE=0
if [ -s "${NVM_DIR}/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "${NVM_DIR}/nvm.sh" >/dev/null 2>&1 || true
  if [ -n "${REQUIRED_NODE}" ]; then
    if ! nvm use "${REQUIRED_NODE}" >/dev/null 2>&1; then
      info "Node v${REQUIRED_NODE} をインストールします（初回のみ）…"
      nvm install "${REQUIRED_NODE}" >/dev/null 2>&1 || true
      nvm use "${REQUIRED_NODE}" >/dev/null 2>&1 && NVM_ACTIVE=1
    else
      NVM_ACTIVE=1
    fi
  fi
fi

# --- 1-b) nvm で解決できなかった場合は volta のツールチェーンを直接たどる
#    volta の既定 runtime は変更せず、必要なバージョンの実体パスを PATH に足す。
#    実体ディレクトリ名には "v" プレフィックスが付きません（例: 22.23.3）。
#    ※ volta のシム（~/.volta/bin/node）は既定バージョンを返すため、
#      実体パスを必ず PATH の先頭に置く必要があります。
if [ "${NVM_ACTIVE}" -eq 0 ] && [ -n "${REQUIRED_NODE}" ]; then
  for _volta_root in "${VOLTA_HOME:-${HOME}/.volta}" "${HOME}/.volta"; do
    _volta_bin="${_volta_root}/tools/image/node/${REQUIRED_NODE}/bin"
    if [ -x "${_volta_bin}/node" ]; then
      PATH="${_volta_bin}:${PATH}"
      export PATH
      hash -r 2>/dev/null || true
      break
    fi
  done
fi

# --- 1-c) それでも要件を満たさなければ取得を試みる（volta があれば install する）
#    .nvmrc は "22" のようなメジャーのみの指定も許容するため、完全一致ではなく
#    「メジャーが一致するか」で判定する。完全一致で判定すると v22.22.3 に対して
#    毎回インストールを試みてしまう。
node_satisfies_required() {
  [ -z "${REQUIRED_NODE}" ] && return 0
  local current major
  current="$(node -v 2>/dev/null || echo '')"
  [ -z "${current}" ] && return 1
  major="${current#v}"
  major="${major%%.*}"
  [ "${major}" = "${REQUIRED_NODE%%.*}" ]
}

if ! node_satisfies_required; then
  if command -v volta >/dev/null 2>&1; then
    info "Node v${REQUIRED_NODE} を取得します（初回のみ）…"
    volta install "node@${REQUIRED_NODE}" >/dev/null 2>&1 || true
    _volta_bin="${VOLTA_HOME:-${HOME}/.volta}/tools/image/node/${REQUIRED_NODE}/bin"
    if [ -x "${_volta_bin}/node" ]; then
      PATH="${_volta_bin}:${PATH}"
      export PATH
      hash -r 2>/dev/null || true
    fi
  fi
fi

CURRENT_NODE="$(node -v 2>/dev/null || echo '未インストール')"
info "Node: ${CURRENT_NODE}"

if [ "${CURRENT_NODE}" = '未インストール' ]; then
  fail "Node.js が見つかりません。Node をインストールしてから再実行してください。"
  exit 1
fi

# .nvmrc は "22" のようなメジャーのみの指定も許容する。
# その場合はメジャー一致だけを検証し、マイナーは問わない。
if [ -n "${REQUIRED_NODE}" ]; then
  REQUIRED_MM="$(node_major_minor "v${REQUIRED_NODE}")"
  CURRENT_MM="$(node_major_minor "${CURRENT_NODE}" || echo '')"
  if [ -n "${CURRENT_MM}" ]; then
    if [ "$(printf '%s\n%s\n' "${REQUIRED_MM}" "${CURRENT_MM}" | sort -t. -k1,1n -k2,2n | head -1)" != "${REQUIRED_MM}" ]; then
      fail "Node ${CURRENT_NODE} は .nvmrc（v${REQUIRED_NODE}）より古いため動作しません。"
      fail "Node v${REQUIRED_NODE} をインストールしてから再実行してください。"
      exit 1
    fi
  fi
fi

# ---------------------------------------------------------------------------
# 2) node_modules を自己修復する
#
#    デバイスが変わると iCloud が symlink を「リンクのまま」配送するため、
#    別デバイスのユーザー名（例: /Users/user/...）を含むリンク切れが届く。
#    従来は `[ -L node_modules ]` だけで健全と判断していたが、リンク切れでも
#    true になるため、npm へ進んで初めて失敗していた。
#    ここでは「リンクが実体として解決できるか」で判定し、
#    解決できなければこのデバイスのパスで作り直す。
# ---------------------------------------------------------------------------
CACHE_ROOT="${HOME}/Library/Caches/com.tystudio/$(basename "${REPO_ROOT}")"
CACHE_DIR="${CACHE_ROOT}/node_modules"

# 実体が解決できるか（リンク切れは -d が false になる）
nm_resolves() { [ -d node_modules ]; }

# node_modules を外部キャッシュへ移し、symlink に戻す。
# npm ci は symlink を実ディレクトリに置き換えるため、インストール後に必ず
# 呼ぶ必要がある。放置すると依存が同期対象のプロジェクト内へ回流する。
nm_externalize() {
  if [ -L node_modules ] && nm_resolves; then
    return 0
  fi
  if [ ! -d node_modules ]; then
    return 0
  fi
  info "node_modules を外部キャッシュへ移します（同期対象から外します）…"
  if bash ./scripts/externalize-node-modules.sh --ensure-link >/dev/null 2>&1; then
    info "外部キャッシュへ移設しました ✓"
  else
    warn "外部化に失敗しました。このまま続行します。"
  fi
}

# 期待するリンク先と一致しているか（$HOME が異なるデバイスからの持ち越しを検出）
nm_target_ok() {
  [ -L node_modules ] || return 1
  [ "$(readlink node_modules)" = "${CACHE_DIR}" ]
}

if nm_resolves && nm_target_ok; then
  info "node_modules: 外部キャッシュへの symlink ✓"
elif [ -L node_modules ] && ! nm_resolves; then
  # --- リンク切れ（別デバイスからの同期の典型症状）
  STALE_TARGET="$(readlink node_modules 2>/dev/null || echo '?')"
  warn "node_modules のリンク切れを検出しました（先: ${STALE_TARGET}）"
  info "このデバイスのパスで再作成します…"
  rm -f node_modules
  mkdir -p "${CACHE_DIR}"
  if ln -s "${CACHE_DIR}" node_modules 2>/dev/null; then
    info "リンクを再作成しました ✓"
  else
    fail "リンクの再作成に失敗しました。"
    exit 1
  fi
  # リンク先は空なので、依存関係そのものを入れる必要がある。
  # 注意: npm ci は node_modules が symlink でも実ディレクトリに置き換える。
  # そのためインストール後に必ず外部化しないと、依存が同期対象の
  # プロジェクト内（数百 MB）へ回流してしまう。
  info "node_modules が空のため npm ci でインストールします（数分かかります）…"
  if npm ci; then
    info "インストールが完了しました ✓"
    nm_externalize
  else
    fail "npm ci に失敗しました。ネットワーク接続を確認してください。"
    exit 1
  fi
elif [ -L node_modules ] && nm_resolves; then
  # --- リンクは有効だが、別の場所（キャッシュ以外）を指している
  warn "node_modules が想定外の場所を指しています（先: $(readlink node_modules)）"
  info "キャッシュ（${CACHE_DIR}）へ付け替えます…"
  rm -f node_modules
  if [ -d "${CACHE_DIR}" ]; then
    ln -s "${CACHE_DIR}" node_modules && info "付け替えました ✓"
  else
    mkdir -p "${CACHE_ROOT}"
    rm -rf node_modules
    mkdir -p "${CACHE_ROOT}/node_modules"
    ln -s "${CACHE_DIR}" node_modules
    warn "キャッシュが空のため npm ci を実行します（数分かかります）…"
    npm ci || { fail "npm ci に失敗しました。"; exit 1; }
    info "インストールが完了しました ✓"
    nm_externalize
  fi
elif [ -d node_modules ]; then
  # --- リポジトリ内に実体として存在する（npm ci 後 / 同期が実体化した場合）
  #     ここでの外部化が同期容量の膨張を防ぐ要点。
  nm_externalize
else
  # --- 存在しない
  info "node_modules がありません。npm ci でインストールします（数分かかります）…"
  if npm ci; then
    info "インストールが完了しました ✓"
    nm_externalize
  else
    fail "npm ci に失敗しました。ネットワーク接続を確認してください。"
    exit 1
  fi
fi

# 最終確認：ここは必ず実体として解決できること
if ! nm_resolves; then
  fail "node_modules を解決できませんでした。'rm -f node_modules' を実行してから再試行してください。"
  exit 1
fi

# ---------------------------------------------------------------------------
# 3) Git インデックスを自己修復する
#    同期で .git/index が欠落することがあり、その場合 git status や
#    pre-commit が 'fatal: bad object HEAD' / 'bad index file' で失敗する。
#    index は HEAD の内容から機械的に再構築できるため、起動時に自動復旧できる。
# ---------------------------------------------------------------------------
if [ "${MA_SKIP_GIT:-0}" != "1" ] && [ -d .git ]; then
  if [ ! -f .git/index ]; then
    warn "Git インデックス（.git/index）が見つかりません。再構築します…"
    if git read-tree HEAD >/dev/null 2>&1; then
      info "Git インデックスを再構築しました ✓"
    else
      warn "Git インデックスの再構築に失敗しました（編集には影響しません）。"
    fi
  elif ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    warn "HEAD が参照するコミットが見つかりません。FETCH_HEAD から復旧を試みます…"
    if [ -f .git/FETCH_HEAD ] && git read-tree FETCH_HEAD >/dev/null 2>&1; then
      info "FETCH_HEAD からインデックスを再構築しました ✓"
    else
      warn "Git の復旧に失敗しました（編集には影響しません）。"
    fi
  fi
fi

# ---------------------------------------------------------------------------
# 4) Safari で編集画面と EN サイトを開く
# ---------------------------------------------------------------------------
# open_browsers は編集画面（ダッシュボード）と、編集結果が反映される EN サイトを
# Safari の同一ウィンドウ・別タブで開く。編集画面を先に開いてフォーカスを当てる。
# EN サイトの自動オープンは環境変数 MA_OPEN_SITE=0 で無効化できる。
MA_OPEN_SITE="${MA_OPEN_SITE:-1}"
open_browsers() {
  if [ "${MA_OPEN_SITE}" = "1" ]; then
    if ! osascript - "${ADMIN_URL}" "${SITE_URL}" <<'APPLESCRIPT'
on run argv
  set adminURL to item 1 of argv
  set siteURL to item 2 of argv
  tell application "Safari"
    activate
    if (count of windows) = 0 then
      make new document with properties {URL:adminURL}
      tell front window
        set adminTab to current tab
        make new tab with properties {URL:siteURL}
        set current tab to adminTab
      end tell
    else
      tell front window
        set adminTab to (make new tab with properties {URL:adminURL})
        make new tab with properties {URL:siteURL}
        set current tab to adminTab
      end tell
    end if
  end tell
end run
APPLESCRIPT
    then
      open -a Safari "${ADMIN_URL}"
      open -a Safari "${SITE_URL}"
    fi
  else
    if ! osascript - "${ADMIN_URL}" <<'APPLESCRIPT'
on run argv
  set adminURL to item 1 of argv
  tell application "Safari"
    activate
    if (count of windows) = 0 then
      make new document with properties {URL:adminURL}
    else
      tell front window to set current tab to (make new tab with properties {URL:adminURL})
    end if
  end tell
end run
APPLESCRIPT
    then
      open -a Safari "${ADMIN_URL}"
    fi
  fi
  return 0
}

if curl -sf -o /dev/null --max-time 2 "${ADMIN_URL}"; then
  info "開発サーバーは既に起動しています（${BASE_URL}）"
  [ "${MA_NO_OPEN:-0}" = "1" ] || open_browsers
  exit 0
fi

# ---------------------------------------------------------------------------
# 5) 開発サーバーを起動し、準備ができたらブラウザを開く
# ---------------------------------------------------------------------------
(
  for _ in $(seq 1 90); do
    if curl -sf -o /dev/null --max-time 2 "${ADMIN_URL}"; then
      if [ "${MA_NO_OPEN:-0}" = "1" ]; then
        info "サーバーが起動しました: ${ADMIN_URL}"
      else
        open_browsers
      fi
      break
    fi
    sleep 1
  done
) &

bold "--- 開発サーバー（Ctrl+C で停止）---"
info "編集画面: ${ADMIN_URL}"
info "EN サイト: ${SITE_URL}"
npm run dev

bold "--- 開発サーバーを停止しました ---"
