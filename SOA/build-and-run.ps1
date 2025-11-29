# build-and-run.ps1
# Run from root folder of SOA project

# Tự động dừng script nếu có lỗi lệnh PowerShell
$ErrorActionPreference = "Stop"

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

# Lưu lại vị trí thư mục gốc ban đầu
$rootPath = Get-Location
Write-Host "Root path is: $rootPath" -ForegroundColor Cyan

Write-Host "===============================" -ForegroundColor Yellow
Write-Host "Starting Docker build for all services..." -ForegroundColor Yellow

foreach ($service in $services) {
    # Tạo đường dẫn tuyệt đối đến thư mục service
    $servicePath = Join-Path -Path $rootPath -ChildPath $service.Name
    
    if (Test-Path $servicePath) {
        Write-Host "-------------------------------"
        Write-Host ("Building {0} on port {1}..." -f $service.Name, $service.Port) -ForegroundColor Green
        
        # Di chuyển vào thư mục service để build
        Set-Location $servicePath
        
        # Thực hiện Build Docker Image
        # Lưu ý: Dockerfile của bạn là Multistage (đã bao gồm mvn package) nên lệnh này là đủ.
        docker build --build-arg PORT=$($service.Port) -t ("soa-{0}:latest" -f $service.Name) .
        
        # [FIX QUAN TRỌNG] Kiểm tra xem lệnh build có thành công không
        if ($LASTEXITCODE -ne 0) {
            Write-Host "!!! BUILD FAILED FOR $($service.Name). STOPPING SCRIPT !!!" -ForegroundColor Red
            Set-Location $rootPath
            exit 1
        }

        Write-Host ("{0} build completed successfully!" -f $service.Name) -ForegroundColor Cyan

        # Quay về thư mục gốc để chuẩn bị cho vòng lặp tiếp theo
        Set-Location $rootPath
    } else {
        Write-Warning ("Folder {0} does not exist at {1}. Skipping..." -f $service.Name, $servicePath)
    }
}

Write-Host "===============================" -ForegroundColor Yellow
Write-Host "All available services built successfully!" -ForegroundColor Green
Write-Host "Starting docker-compose..." -ForegroundColor Yellow

# Chạy Docker Compose từ thư mục gốc
# Lệnh này sẽ dùng các image soa-*-service:latest vừa build xong
docker-compose up -d

# Kiểm tra kết quả docker-compose
if ($LASTEXITCODE -eq 0) {
    Write-Host "===============================" -ForegroundColor Yellow
    Write-Host "All services are starting up!" -ForegroundColor Green
    Write-Host "Check status with: docker-compose ps"
} else {
    Write-Host "docker-compose failed to start." -ForegroundColor Red
}