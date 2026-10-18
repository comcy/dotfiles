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
