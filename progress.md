# AI Resume Screener - Progress Log

_Last updated: July 10, 2026. Current state: Module 1 and Module 2 complete._

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
- Neon PostgreSQL environment variables have been configured for the backend runtime.
- Google OAuth environment variables have been configured for the backend runtime.
- Backend startup and working runtime flow have been verified after configuration.

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
- Secrets stay in environment variables and are not committed into the repository.

### Known Issues / Watch-outs
- The backend depends on valid local environment variables for Neon, JWT, and Google OAuth in runtime environments.
- Frontend was intentionally left for Module 2 and beyond.
- Resume upload, PDF parsing, Gemini AI, RAG, pgvector, Trivy, Gitleaks, Prometheus, Grafana, Render deployment, and Neon production setup are future modules.

### What Module 2 Will Find Ready
- Backend auth endpoints ready:
- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT generation and validation ready.
- Google OAuth2 backend success flow ready.
- Neon DB-backed backend runtime configured.
- CORS prepared for React localhost:5173.
- Actuator health endpoint ready for cold-start splash screen.
- CodeQL workflow ready.
- Dockerfile ready.

## Module 2 - Auth Frontend + Cold Start Screen

### Completed
- `frontend/package.json` updated to include the Module 2 frontend dependencies and build tooling.
- `frontend/.env.example` added to document `VITE_API_URL=http://localhost:8080` for local frontend/backend integration.
- `frontend/tailwind.config.js` created to define the dark design system, typography, shadows, gradients, and animations.
- `frontend/postcss.config.js` created to wire Tailwind CSS and Autoprefixer into the Vite build.
- `frontend/src/index.css` replaced the starter styles with global Tailwind layers, dark theming, font imports, and shared visual utilities.
- `frontend/src/api/axios.js` created as the reusable Axios instance with a JWT request interceptor and 401 handling.
- `frontend/src/context/AuthContext.jsx` created as the auth provider that manages login, register, logout, loading, error, and localStorage-backed token state.
- `frontend/src/context/auth-context.js` and `frontend/src/context/useAuth.js` split the context object and hook cleanly for lint-safe consumption.
- `frontend/src/components/SplashScreen.jsx` created to poll `/actuator/health` every 8 seconds for up to 10 attempts before allowing the app through.
- `frontend/src/components/BackendStatusBanner.jsx` created to warn the user if the backend still appears to be cold-starting after the splash timeout.
- `frontend/src/components/ProtectedRoute.jsx` created to block unauthenticated routes and redirect to `/login`.
- `frontend/src/components/AppLayout.jsx`, `Navbar.jsx`, and `Sidebar.jsx` created as the reusable protected dashboard shell for current and future modules.
- `frontend/src/components/AuthCard.jsx` and `frontend/src/components/LoadingSpinner.jsx` created to keep auth screens and loading states consistent.
- `frontend/src/components/ui/button.jsx`, `input.jsx`, `card.jsx`, and `badge.jsx` created as Shadcn-compatible local UI primitives.
- `frontend/src/lib/utils.js` created with `cn()` for class composition using `clsx` and `tailwind-merge`.
- `frontend/src/pages/Login.jsx` created with recruiter-facing sign-in UI, backend login integration, and Google OAuth launch flow.
- `frontend/src/pages/Register.jsx` created with frontend validation, backend registration integration, and login redirect fallback.
- `frontend/src/pages/OAuthCallback.jsx` created to capture `?token=...`, `?access_token=...`, or `?jwt=...` and finalize Google sign-in.
- `frontend/src/pages/Dashboard.jsx` created as the protected landing shell with animated placeholders for jobs, uploads, screening, and chatbot modules.
- `frontend/src/pages/Jobs.jsx` created as the protected Module 3 placeholder route.
- `frontend/src/pages/Chat.jsx` created as the protected Module 6 placeholder route.
- `frontend/src/pages/NotFound.jsx` created as the custom unmatched-route fallback.
- `frontend/src/App.jsx` replaced the Vite starter and now owns BrowserRouter setup, AuthProvider setup, SplashScreen flow, protected routes, and page routing.
- `frontend/src/main.jsx` kept the app bootstrap simple and continues to render `App` with global CSS.
- Axios now attaches `Authorization: Bearer <token>` from localStorage automatically to authenticated backend calls.
- The SplashScreen retry logic and `/actuator/health` bootstrap flow are implemented and verified in build output.
- AuthContext now handles localStorage token persistence, backend-friendly error messaging, and OAuth token hydration.
- Login, register, OAuth callback, protected routing, dashboard shell, jobs placeholder, and chat placeholder are all wired into the router.
- UI/theme/animation libraries used in Module 2: Tailwind CSS, Framer Motion, Lucide React, `class-variance-authority`, `clsx`, and `tailwind-merge`.

### Key Design Decisions
- JWT is stored in localStorage because this module is a client-rendered recruiter portal and the backend already returns JWTs directly from auth endpoints and OAuth success redirect flow.
- `VITE_API_URL` is used as the single frontend backend-origin variable so local, staging, and future hosted environments can swap API targets without code changes.
- The Google OAuth redirect is constructed from `VITE_API_URL` plus `/oauth2/authorization/google` because the backend OAuth entrypoint is not under `/api`.
- SplashScreen stops after 10 attempts so recruiters are not trapped behind an infinite loading gate when free-tier cold starts or backend boot issues occur.
- Dashboard, jobs, upload, screening, and chatbot surfaces are intentionally placeholder shells so Module 3 can focus on Job Description Management and Module 6 can focus on the RAG chatbot.
- Shadcn-compatible component structure was implemented locally under `src/components/ui` instead of running a generator, which keeps the app modular without overwriting the Vite project.
- Backend code was not modified in Module 2 because Module 1 already exposed the necessary auth and health endpoints with CORS for `http://localhost:5173`.

### Known Issues / Watch-outs
- Backend must be running on `http://localhost:8080` unless `VITE_API_URL` is changed.
- Frontend expects backend CORS to allow `http://localhost:5173`, which Module 1 already configured.
- Google OAuth sign-in depends on valid backend Google credentials and the backend redirect flow returning a token query parameter.
- Tailwind, PostCSS, Framer Motion, Lucide React, React Router v6, and helper UI libraries were added in Module 2.
- The frontend build needed to be verified outside the sandbox because Vite helper process spawning hit a Windows sandbox `EPERM`; this was environmental, not a frontend code issue.
- `frontend/src/App.css` remains from the starter project but is unused by the Module 2 app and can be removed later if desired.

### What Module 3 Will Find Ready
- React frontend created and running.
- Auth UI ready.
- JWT storage and Axios interceptor ready.
- Protected routes ready.
- Reusable dashboard/layout shell ready.
- `/jobs` route exists and is ready for Job Description Management.
- Backend health splash screen ready.
