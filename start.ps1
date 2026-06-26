Write-Host "Iniciando PetBlood..." -ForegroundColor Cyan

$backend = Start-Job -Name "backend" -ScriptBlock {
    cd "D:\PetBlood\petblood\backend"
    mvn spring-boot:run
}

$frontend = Start-Job -Name "frontend" -ScriptBlock {
    cd "D:\PetBlood\petblood\frontend"
    npm install
    npm run dev
}

Write-Host "Backend e Frontend rodando. Logs abaixo (Ctrl+C para parar):" -ForegroundColor Green
Write-Host "  Backend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Yellow

try {
    while ($true) {
        Receive-Job -Name "backend" | ForEach-Object { Write-Host "[BACKEND] $_" -ForegroundColor Blue }
        Receive-Job -Name "frontend" | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor Magenta }
        Start-Sleep -Seconds 1
    }
} finally {
    Stop-Job -Name "backend", "frontend"
    Remove-Job -Name "backend", "frontend"
    Write-Host "Servidores encerrados." -ForegroundColor Red
}
