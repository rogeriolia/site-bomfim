# Cadastra SSH no GitHub Actions (uma vez). Abre login no navegador e grava os 3 secrets.
param(
  [string]$KeyPath = "$env:USERPROFILE\.ssh\site_bomfim_deploy",
  [string]$SshHost = "216.128.169.75",
  [string]$SshUser = "root",
  [string]$Repo = "rogeriolia/site-bomfim"
)

$gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Error "Instale o GitHub CLI (winget install GitHub.cli) e rode de novo."
  exit 1
}
& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Login no GitHub (conclua no navegador)..."
  & $gh auth login -h github.com -p https -w
}
if (-not (Test-Path $KeyPath)) {
  Write-Error "Chave não encontrada: $KeyPath"
  exit 1
}
& $gh secret set SSH_HOST --repo $Repo --body $SshHost
& $gh secret set SSH_USER --repo $Repo --body $SshUser
Get-Content -Raw $KeyPath | & $gh secret set SSH_PRIVATE_KEY --repo $Repo
Write-Host "Secrets gravados em $Repo. Actions -> Deploy site + API para testar."
Get-Content "$KeyPath.pub" | ForEach-Object {
  Write-Host "Chave pública (deve estar no authorized_keys do servidor): $_"
}