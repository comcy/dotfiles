#!/bin/sh
# Link herdr config from this repo; link plugins from a local herdr-plugins clone.
# usage: herdr/setup.sh [path-to-herdr-plugins]   (default: ~/Workspace/herdr-plugins)
set -eu
here=$(cd "$(dirname "$0")" && pwd)
plugins=${1:-$HOME/Workspace/herdr-plugins}
[ -d "$plugins" ] || git clone https://github.com/comcy/herdr-plugins "$plugins"
mkdir -p "$HOME/.config/herdr"
ln -sfn "$here/config.toml" "$HOME/.config/herdr/config.toml"
for p in claude-layout gh-watch ado-watch; do herdr plugin link "$plugins/$p" >/dev/null; done
herdr config check

# herdr-app (native app): keybindings + mods/layout `main-code` from herdr-plugins/herdr-app
if [ -d "$HOME/.config/herdr-app" ] || command -v herdr-app >/dev/null 2>&1; then
  mkdir -p "$HOME/.config/herdr-app"
  [ -f "$HOME/.config/herdr-app/keys.json" ] && cp "$HOME/.config/herdr-app/keys.json" "$HOME/.config/herdr-app/keys.json.bak"
  cp "$here/app/keys.json" "$HOME/.config/herdr-app/keys.json"
  "$plugins/herdr-app/install.sh"
fi
