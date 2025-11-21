# Stage 1: Build với Maven image
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src src
RUN mvn clean install -DskipTests

# Stage 2: Runtime với JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
EXPOSE 8080

RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy fat JAR chính xác
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
