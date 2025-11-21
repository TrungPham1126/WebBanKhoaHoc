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

Write-Host "==============================="
Write-Host "Starting Docker build for all services..."

foreach ($service in $services) {
    $servicePath = Join-Path -Path $PWD -ChildPath $service.Name
    if (Test-Path $servicePath) {
        Write-Host "-------------------------------"
        Write-Host ("Building {0} on port {1}..." -f $service.Name, $service.Port)
        Set-Location $servicePath
        docker build --build-arg PORT=$($service.Port) -t ("soa-{0}:latest" -f $service.Name) .
        Write-Host ("{0} build completed!" -f $service.Name)
        Set-Location $PWD
    } else {
        Write-Warning ("Folder {0} does not exist. Skipping..." -f $service.Name)
    }
}

Write-Host "==============================="
Write-Host "All available services built successfully!"
Write-Host "Starting docker-compose..."
docker-compose up -d
Write-Host "==============================="
Write-Host "All services should be up now!"
