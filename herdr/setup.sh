#!/bin/sh
# Link herdr config from this repo; link plugins from a local herdr-plugins clone.
# usage: herdr/setup.sh [path-to-herdr-plugins]   (default: ~/Workspace/herdr-plugins)
set -eu
here=$(cd "$(dirname "$0")" && pwd)
plugins=${1:-$HOME/Workspace/herdr-plugins}
mkdir -p "$HOME/.config/herdr"
ln -sfn "$here/config.toml" "$HOME/.config/herdr/config.toml"
for p in claude-layout gh-watch; do herdr plugin link "$plugins/$p" >/dev/null; done
herdr config check
