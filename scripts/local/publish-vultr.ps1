# Publica o que está na main do GitHub no Vultr (mesmo fluxo do primeiro deploy / bootstrap).
# Não usa GitHub Actions. Requer chave site_bomfim_deploy ou BOMFIM_SSH_TUNNEL no .env.
param(
  [string]$KeyPath = "$env:USERPROFILE\.ssh\site_bomfim_deploy",
  [string]$HostTarget = ""
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
if (-not $HostTarget) {
  $envFile = Join-Path $root '.env'
  if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
      if ($line -match '^\s*BOMFIM_SSH_TUNNEL=(.+)$') {
        $HostTarget = $Matches[1].Trim().Trim('"')
        break
      }
    }
  }
}
if (-not $HostTarget) {
  Write-Error "Informe -HostTarget root@IP ou defina BOMFIM_SSH_TUNNEL no .env"
  exit 1
}
if (-not (Test-Path $KeyPath)) {
  Write-Error "Chave não encontrada: $KeyPath"
  exit 1
}

$bootstrap = "curl -fsSL https://raw.githubusercontent.com/rogeriolia/site-bomfim/main/scripts/server/bootstrap-from-github.sh -o /tmp/bootstrap.sh && bash /tmp/bootstrap.sh"
Write-Host "Publicando no Vultr via bootstrap (GitHub main -> /opt/site-bomfim)..."
ssh -i $KeyPath -o BatchMode=yes $HostTarget $bootstrap