# Massgebliche Skriptquelle: diese Datei (comcy/dotfiles), Schwester von scripts/git-scratch (sh). Konventionsquelle:
# github.com/comcy/kvasir (`kvasir.scratch`); Pfad-/Aufloesungsregeln dort und in git-scratch identisch halten.
# git-scratch.ps1: detached Scratch-Worktrees to look at a ref in isolation (PowerShell 5.1 and 7+, no modules).
# Same convention as `kvasir scratch`. Starts nothing but git (argument lists only).
#   git-scratch.ps1 add <ref>              print the path on stdout (everything else goes to stderr)
#   git-scratch.ps1 list
#   git-scratch.ps1 clean [<ref>] [-Force]
param(
    [Parameter(Position = 0)][string]$Command = '',
    [Parameter(Position = 1)][string]$Ref = '',
    [switch]$Force
)
$ErrorActionPreference = 'Continue'   # native stderr must not turn into terminating errors on 5.1

function Fail([string]$Msg) { [Console]::Error.WriteLine("git-scratch: $Msg"); exit 1 }

# git output -> stderr, so stdout carries only the path
function GitErr {
    & git @args 2>&1 | ForEach-Object { [Console]::Error.WriteLine("$_") }
    return $LASTEXITCODE
}

$common = (& git rev-parse --path-format=absolute --git-common-dir 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $common) { Fail 'not in a git repository' }
$common = [IO.Path]::GetFullPath(("$common").Trim()).TrimEnd('\', '/')
$parent = Split-Path -Parent $common
$leaf = Split-Path -Leaf $common
# Bare layout: <root>/.scratch; normal clone: sibling <repo>.scratch; plain bare repo: <name>.scratch next to it
if ($leaf -eq '.bare') { $sd = Join-Path $parent '.scratch' }
elseif ($leaf -eq '.git') { $sd = Join-Path (Split-Path -Parent $parent) ((Split-Path -Leaf $parent) + '.scratch') }
else { $sd = Join-Path $parent ($leaf + '.scratch') }

function Get-Slug([string]$r) { $r.Replace('/', '--') }

function Get-Scratch {
    foreach ($line in (& git worktree list --porcelain)) {
        if ($line.StartsWith('worktree ')) {
            $p = [IO.Path]::GetFullPath($line.Substring(9))
            # -ieq: case-insensitive (Windows); harmless elsewhere
            if ((Split-Path -Parent $p) -ieq $sd) { $p }
        }
    }
}

function Remove-Scratch([string]$p) {
    if ($Force) { $rc = GitErr worktree remove --force $p } else { $rc = GitErr worktree remove $p }
    if ($rc -ne 0) { return $false }
    GitErr worktree prune | Out-Null
    return $true
}

switch ($Command) {
    'add' {
        if (-not $Ref) { Fail 'usage: git-scratch.ps1 add <ref>' }
        $target = Join-Path $sd (Get-Slug $Ref)
        if (Test-Path -LiteralPath $target) { Write-Output $target; exit 0 }
        if ((GitErr fetch --quiet) -ne 0) { [Console]::Error.WriteLine('git-scratch: warning: fetch failed') }
        foreach ($cand in @("refs/heads/$Ref", "refs/remotes/origin/$Ref", $Ref)) {
            & git rev-parse --verify --quiet "$cand^{commit}" *> $null
            if ($LASTEXITCODE -eq 0) {
                New-Item -ItemType Directory -Force -Path $sd | Out-Null
                if ((GitErr worktree add --detach $target $cand) -ne 0) { exit 1 }
                Write-Output $target
                exit 0
            }
        }
        Fail "unknown ref: $Ref"
    }
    'list' { Get-Scratch }
    'clean' {
        $ok = $true
        if ($Ref) { $targets = @(Join-Path $sd (Get-Slug $Ref)) } else { $targets = @(Get-Scratch) }
        foreach ($t in $targets) { if (-not (Remove-Scratch $t)) { $ok = $false } }
        if (-not $ok) { exit 1 }
        exit 0
    }
    default { Fail 'usage: git-scratch.ps1 add <ref> | list | clean [<ref>] [-Force]' }
}
