# Testa SSH com a chave de deploy (não altera secrets do GitHub).
# Uso: .\scripts\local\test-deploy-ssh.ps1 [-KeyPath ~\.ssh\site_bomfim_deploy]
param(
  [string]$KeyPath = "$env:USERPROFILE\.ssh\site_bomfim_deploy"
)

$envFile = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) '.env'
$target = $env:BOMFIM_SSH_TUNNEL
if (-not $target -and (Test-Path $envFile)) {
  foreach ($line in Get-Content $envFile) {
    if ($line -match '^\s*BOMFIM_SSH_TUNNEL=(.+)$') {
      $target = $Matches[1].Trim().Trim('"')
      break
    }
  }
}
if (-not $target) {
  Write-Error "Defina BOMFIM_SSH_TUNNEL no .env local ou exporte a variável."
  exit 1
}
if (-not (Test-Path $KeyPath)) {
  Write-Error "Chave não encontrada: $KeyPath"
  exit 1
}

ssh -i $KeyPath -o BatchMode=yes -o ConnectTimeout=15 $target "echo ok && ls -la /opt/site-bomfim/dist/index.html 2>/dev/null || echo dist ainda ausente"