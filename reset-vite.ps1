Write-Host "🧹 Borrando caché de Vite..."
Remove-Item -Recurse -Force .\node_modules\.vite

Write-Host "🚀 Reiniciando servidor con npm run dev..."
Start-Process powershell -ArgumentList "npm run dev"
