Write-Host "Univera Starting..." -ForegroundColor Cyan

minikube start

minikube docker-env | Invoke-Expression

docker build -t univera/backend:latest ./backend

docker compose up -d

kubectl rollout restart deployment/backend -n univera

Start-Sleep -Seconds 10

Write-Host "--- Docker Status ---" -ForegroundColor Green
docker ps --format "table {{.Names}}`t{{.Status}}"

Write-Host "--- K8s Status ---" -ForegroundColor Green
kubectl get pods -n univera

Write-Host "Ready!" -ForegroundColor Green
Write-Host "Website    : http://localhost"
Write-Host "Grafana    : http://localhost:3001"
Write-Host "Prometheus : http://localhost:9090"
Write-Host "K8s Site   : http://univera.local"