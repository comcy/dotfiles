# zsh-Konfiguration (oh-my-zsh). Enthält keine Zugangsdaten und keine rechnerspezifischen Pfade.
# Einrichtung: siehe README.md, Abschnitt ".zshrc".

export ZSH="$HOME/.oh-my-zsh"

# Sprache
export LANG=de_DE.UTF-8
export LC_ALL=de_DE.UTF-8

# PATH: eigene Verzeichnisse vorn (später genannt = höhere Priorität)
export PATH="$HOME/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.opencode/bin:$PATH"

# Theme (braucht eine Powerline-fähige Schrift)
ZSH_THEME="agnoster"

# Plugins. zsh-autosuggestions und zsh-syntax-highlighting sind Custom-Plugins und müssen
# nach $ZSH_CUSTOM/plugins geklont werden (siehe README.md).
plugins=(
    git
    aliases
    npm
    zsh-autosuggestions
    zsh-syntax-highlighting
    zsh-interactive-cd
)

source $ZSH/oh-my-zsh.sh

# npm: globale Pakete ohne sudo
NPM_PACKAGES="$HOME/.npm-global"
export PATH="$PATH:$NPM_PACKAGES/bin"
# MANPATH erhalten, sonst auf `manpath` zurückfallen
export MANPATH="${MANPATH-$(manpath)}:$NPM_PACKAGES/share/man"
