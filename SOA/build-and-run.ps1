# build-and-run.ps1
# Run from root folder of SOA project

$services = @(
    @{ Name = "discovery-service"; Port = 8761 },
    @{ Name = "config-service"; Port = 8888 },
    @{ Name = "api-gateway"; Port = 8080 },
    @{ Name = "user-service"; Port = 8081 },
    @{ Name = "course-service"; Port = 8082 },
    @{ Name = "payment-service"; Port = 8083 },
    @{ Name = "enrollment-service"; Port = 8084 },
    @{ Name = "notification-service"; Port = 8085 }
)

# --- SỬA LỖI QUAN TRỌNG: Lưu lại vị trí thư mục gốc ban đầu ---
$rootPath = Get-Location
Write-Host "Root path is: $rootPath"

Write-Host "==============================="
Write-Host "Starting Docker build for all services..."

foreach ($service in $services) {
    # Luôn nối đường dẫn từ $rootPath để đảm bảo chính xác
    $servicePath = Join-Path -Path $rootPath -ChildPath $service.Name
    
    if (Test-Path $servicePath) {
        Write-Host "-------------------------------"
        Write-Host ("Building {0} on port {1}..." -f $service.Name, $service.Port)
        
        # Đi vào thư mục service
        Set-Location $servicePath
        
        # Thực hiện Build
        docker build --build-arg PORT=$($service.Port) -t ("soa-{0}:latest" -f $service.Name) .
        
        Write-Host ("{0} build completed!" -f $service.Name)
        
        # --- SỬA LỖI QUAN TRỌNG: Quay về thư mục gốc ---
        Set-Location $rootPath
    } else {
        Write-Warning ("Folder {0} does not exist at {1}. Skipping..." -f $service.Name, $servicePath)
    }
}

Write-Host "==============================="
Write-Host "All available services built successfully!"
Write-Host "Starting docker-compose..."

# Chạy Docker Compose từ thư mục gốc
docker-compose up -d

Write-Host "==============================="
Write-Host "All services should be up now!"
