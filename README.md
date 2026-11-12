# dotfiles
My private dotfile collection.

## scripts/

Kleine, systemunabhängige Helfer (POSIX `sh`; unter Windows Git Bash/WSL). Repo klonen und direkt aufrufen, ein Symlink ist optional:

```sh
git clone https://github.com/comcy/dotfiles ~/dotfiles
~/dotfiles/scripts/git-scratch add feat/foo      # optional: ln -s ~/dotfiles/scripts/git-scratch ~/.local/bin/git-scratch
```

| Skript | Zweck |
|---|---|
| `git-scratch` | Branch/Ref isoliert ansehen: detached Scratch-Worktree anlegen (`add <ref>`, Pfad auf stdout), `list`, `clean [<ref>] [--force]`. Startet nur `git`, keine Tests oder Installationen. Gleiche Konvention wie `kvasir scratch` (Konventionsquelle: kvasir); das Skript wird hier gepflegt. |
| `git-scratch.ps1` | Native PowerShell-Variante (5.1 und 7+, keine Module) von `git-scratch`: `add <ref>`, `list`, `clean [<ref>] [-Force]`, gleiche Konvention und Pfade wie `kvasir scratch`. Aufruf z. B. `powershell -ExecutionPolicy Bypass -File scripts\git-scratch.ps1 add feat/foo`; alternativ einmal `Unblock-File scripts\git-scratch.ps1` (nach Download/Klon als Zip) und `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |

## arbeits-vault/

Obsidian-Vault-Blueprint für die Arbeit (PARA, Journal, Meeting-Notizen, Termine, Todos). Nur Core-Plugins, reine Markdown-Dateien, optionale Node-Skripte (Todo-Sammlung, Azure-DevOps-Metriken). Einrichtung: [`arbeits-vault/README.md`](arbeits-vault/README.md). Die früheren `vault-kits/` (Obsidian/Logseq mit Community-Plugins) sind entfernt und in der Git-Historie (PR #4) abrufbar.

## .zshrc

zsh-Konfiguration mit oh-my-zsh (Theme `agnoster`, Plugins `git`, `aliases`, `npm`, `zsh-autosuggestions`, `zsh-syntax-highlighting`, `zsh-interactive-cd`), Sprache `de_DE.UTF-8` und PATH-Ergänzungen. Keine Zugangsdaten, keine festen Home-Pfade (`$HOME` statt Benutzername). Als Referenz gedacht: Teile entnehmen oder die Datei nach `~/.zshrc` kopieren.

```sh
# 1. oh-my-zsh installieren (siehe https://ohmyz.sh), danach die beiden Custom-Plugins:
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 2. Konfiguration übernehmen (bestehende ~/.zshrc vorher sichern)
cp .zshrc ~/.zshrc
```

Hinweise: `agnoster` braucht eine Powerline-fähige Schrift; die `de_DE`-Locale muss installiert sein; `LC_ALL` zu setzen überschreibt alle anderen `LC_*`-Variablen.
