# Builds and runs the DriveMe Spring Boot backend (src/main/java/driveme/...).
# Used by Render (or any Docker-based host) to deploy the API.
#
# Two stages: the first compiles the app with Maven (needs the JDK + all the
# build tooling), the second copies only the resulting jar into a slim JRE
# image so the final image doesn't ship Maven/the JDK/source code.
#
# java.version in pom.xml is 1.8, hence eclipse-temurin:8 for both stages.

FROM eclipse-temurin:8-jdk AS build
WORKDIR /app

# Copy just the POM first so Docker can cache the downloaded dependencies
# layer as long as pom.xml doesn't change, instead of re-downloading on
# every source code change.
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
# mvnw was committed from Windows and may have CRLF line endings, which
# breaks its "#!/bin/sh" shebang inside this Linux image — strip them
# defensively before making it executable.
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -q -B dependency:go-offline || true

COPY src ./src
RUN ./mvnw -q -B clean package -DskipTests

FROM eclipse-temurin:8-jre
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Render assigns the port to listen on via the PORT env var; server.port in
# application.properties is ${PORT:8081}, so this just needs PORT to reach
# the JVM — Render sets that automatically for web services.
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
