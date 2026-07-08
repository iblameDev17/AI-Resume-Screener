# AI Resume Screener - Progress Log

_Last updated: July 2, 2026. Current state: Module 1 complete._

## Module 1 - Project Setup + Auth Backend

### Completed
- `backend/pom.xml` updated to a Spring Boot 3.x Module 1 dependency set with Web, Security, JPA, OAuth2 client, Validation, Actuator, WebFlux, PostgreSQL, Prometheus, JJWT, Lombok, and test-only H2 support.
- `backend/src/main/java/com/dev/resume_screener/user/User.java` created for the `users` table with recruiter auth fields and safe defaults.
- `backend/src/main/java/com/dev/resume_screener/user/UserRepository.java` created with `findByEmail` and `existsByEmail`.
- `backend/src/main/java/com/dev/resume_screener/auth/RegisterRequest.java`, `LoginRequest.java`, and `AuthResponse.java` created for validated auth DTOs.
- `backend/src/main/java/com/dev/resume_screener/security/JwtUtil.java` and `JwtAuthFilter.java` created for JWT generation, parsing, validation, and request authentication.
- `backend/src/main/java/com/dev/resume_screener/config/SecurityConfig.java` added stateless security with public auth routes and protected non-health endpoints.
- `backend/src/main/java/com/dev/resume_screener/auth/AuthController.java` added with `POST /api/auth/register` and `POST /api/auth/login`.
- `backend/src/main/java/com/dev/resume_screener/auth/OAuth2SuccessHandler.java` added to upsert Google users and redirect with a JWT token.
- `backend/src/main/java/com/dev/resume_screener/exception/GlobalExceptionHandler.java` added for clean JSON errors without stack traces.
- `backend/src/main/java/com/dev/resume_screener/config/CorsConfig.java` added for localhost:5173 and env-configured frontend CORS support.
- `backend/src/main/resources/application.yml` added with environment-variable-based PostgreSQL, OAuth2, JWT, frontend URL, and Actuator configuration.
- Actuator endpoints configured for `health`, `info`, `metrics`, and `prometheus`.
- `backend/src/test/resources/application-test.yml` and the context test profile were added so tests do not require a live Neon database.
- `.github/workflows/codeql.yml` created at the repo root with push, pull request, and weekly CodeQL scans for the Java backend.
- `backend/Dockerfile` created as a multi-stage Java 17 build/runtime image.

### Key Design Decisions
- JWT expiry set to 24h using `app.jwt.expiration-ms`.
- Local users use BCrypt password hashing.
- Google OAuth users are created with provider GOOGLE and null password.
- Only `/actuator/health` is public; other actuator endpoints are protected.
- Neon PostgreSQL is configured through environment variables.
- `DATABASE_URL` must be JDBC-style, for example `jdbc:postgresql://host/db?sslmode=require`.
- Neon's copied URL may need conversion from `postgresql://user:pass@host/db` to `jdbc:postgresql://host/db?sslmode=require` with username/password stored separately.
- No secrets are hardcoded.
- CodeQL is added in Module 1 so later modules are scanned early.

### Known Issues / Watch-outs
- The real Neon database has not been created yet.
- The real Google OAuth credentials have not been created yet.
- The backend should compile without those real credentials, but full runtime DB/OAuth testing requires setting environment variables later.
- Frontend is not built yet.
- Resume upload, PDF parsing, Gemini AI, RAG, pgvector, Trivy, Gitleaks, Prometheus, Grafana, Render deployment, and Neon production setup are future modules.

### What Module 2 Will Find Ready
- Backend auth endpoints ready:
- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT generation and validation ready.
- Google OAuth2 backend success flow ready.
- CORS prepared for React localhost:5173.
- Actuator health endpoint ready for cold-start splash screen.
- CodeQL workflow ready.
- Dockerfile ready.
