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
