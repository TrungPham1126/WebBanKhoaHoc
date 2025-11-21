# Stage 1: Build với Maven image
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom và source code
COPY pom.xml .
COPY src src

# Build fat JAR Spring Boot, skip test
RUN mvn clean package -DskipTests

# Stage 2: Runtime với JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Set cổng Spring Boot (chỉnh theo service)
ARG PORT=8080
EXPOSE ${PORT}

# Tạo user không phải root
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy fat JAR chính xác
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Entry point
ENTRYPOINT ["java", "-jar", "app.jar"]
