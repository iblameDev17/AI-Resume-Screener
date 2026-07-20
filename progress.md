# AI Resume Screener - Progress Log

_Last updated: July 20, 2026. Current state: Module 1, Module 2, Module 3, and Module 4 complete._

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

## Module 3 - Job Description Management

### Completed
- Backend job module created under `backend/src/main/java/com/dev/resume_screener/job/`:
- `Job.java`
- `JobRepository.java`
- `JobRequest.java`
- `JobResponse.java`
- `JobService.java`
- `JobController.java`
- Backend tests added for Module 3:
- `backend/src/test/java/com/dev/resume_screener/job/JobRequestValidationTest.java`
- `backend/src/test/java/com/dev/resume_screener/job/JobServiceTest.java`
- `backend/src/test/java/com/dev/resume_screener/job/JobControllerTest.java`
- Frontend files created or updated for the job management flow:
- `frontend/src/api/jobs.js`
- `frontend/src/lib/jobs.js`
- `frontend/src/components/jobs/RequiredSkillsInput.jsx`
- `frontend/src/components/jobs/JobForm.jsx`
- `frontend/src/components/jobs/JobCard.jsx`
- `frontend/src/components/jobs/JobList.jsx`
- `frontend/src/components/jobs/DeleteJobDialog.jsx`
- `frontend/src/pages/Jobs.jsx`
- `frontend/src/pages/JobDetail.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/App.jsx`
- `frontend/tailwind.config.js`
- The `Job` entity fields are:
- `id`
- `title`
- `description`
- `requiredSkills`
- `createdBy`
- `createdAt`
- `Job.createdBy` is a `ManyToOne` relationship to `User` using the `created_by` foreign key.
- API endpoints implemented:
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/jobs/{id}`
- `DELETE /api/jobs/{id}`
- All job endpoints require JWT authentication.
- Recruiters can only access their own jobs because all single-job reads/deletes resolve by both `id` and the current authenticated `User`.
- The frontend jobs page now includes loading, error, empty, list, create-job, and delete-confirmation states.
- The frontend job detail page now shows job metadata, required skill chips, full job description, and a Module 4 upload placeholder area/button.
- Dashboard integration now links the recruiter into live job data and recent jobs.
- Sidebar routing remains compatible for `/`, `/jobs`, `/jobs/:id`, and `/chat`.
- `/jobs/:id` is ready for Module 4 resume upload.

### Key Design Decisions
- Confirmed from `backend/src/main/java/com/dev/resume_screener/security/JwtAuthFilter.java`: the JWT filter stores a Spring Security `UserDetails` object as the authentication principal. `JobService.getCurrentUser()` reads `UserDetails.getUsername()` first and then loads the matching `User` entity through `UserRepository.findByEmail(...)`.
- `requiredSkills` is stored as plain `TEXT` / comma-separated text for simplicity and to match the provided database blueprint.
- The frontend collects required skills with a chip input, joins them to comma-separated text before create requests, and splits that text back into chips/badges when jobs are displayed.
- The frontend job API client uses the existing Axios instance and existing JWT interceptor at `frontend/src/api/axios.js`, so all job requests reuse the current `Authorization: Bearer <token>` flow automatically.
- Module 4 was intentionally left as a placeholder on the job detail page: upload UI entry point only, no PDF parsing, no resume ingestion, no scoring, and no chatbot logic yet.
- No backend files outside the new job module were changed because the existing security, auth, CORS, and global exception handling were already sufficient for protected per-user job CRUD.
- `spring.jpa.hibernate.ddl-auto` is `update` in `backend/src/main/resources/application.yml`, so Hibernate creates the `jobs` table automatically on startup. During Module 3 verification, the H2-backed test logs confirmed Hibernate emitted `create table jobs (...)` with the expected columns and foreign key.

### Known Issues / Watch-outs
- Backend must be running with valid Neon/PostgreSQL, JWT, and Google OAuth environment variables for the full application flow.
- Frontend local development expects `VITE_API_URL=http://localhost:8080`.
- Because `ddl-auto` is `update`, the `jobs` table should be created automatically anywhere that setting is preserved. If another environment overrides it to `validate` or `none`, the schema must be created before job endpoints will work.
- Existing CORS expectations are unchanged: local frontend at `http://localhost:5173`, backend at `http://localhost:8080`.
- Module 3 verification completed with `backend/./mvnw test`, `frontend/npm run lint`, and `frontend/npm run build`.
- The frontend production build still needs to be run outside the Windows sandbox in this Codex environment because Vite helper process spawning triggers a sandbox `EPERM`; this is environmental and not a code defect.
- Manual browser testing and long-running `spring-boot:run` / `npm run dev` sessions were not executed in this pass.

### What Module 4 Will Find Ready
- Job CRUD backend is complete.
- `/api/jobs` endpoints are protected and working.
- Jobs are tied to the authenticated recruiter.
- Frontend `/jobs` page is complete.
- Frontend `/jobs/:id` job detail page is complete.
- Job detail page has a placeholder area/button for Resume Upload.
- Existing Axios JWT interceptor is used for all job API calls.
- Module 4 can add PDF resume upload directly into the job detail page.

## Module 4 - Resume Upload + PDF Parsing

### Completed
- Backend dependency and configuration changes:
- `backend/pom.xml` updated to add Apache PDFBox `3.0.8`.
- `backend/src/main/resources/application.yml` updated with multipart limits: `max-file-size: 10MB` and `max-request-size: 220MB`.
- Backend ownership/security support changes:
- `backend/src/main/java/com/dev/resume_screener/user/CurrentUserService.java` created to centralize authenticated recruiter lookup through `UserRepository.findByEmail(...)` using the current Spring Security principal.
- `backend/src/main/java/com/dev/resume_screener/job/JobService.java` updated to use `CurrentUserService` and to delete candidate links plus linked resumes before deleting a job so Module 4 data does not leave broken foreign keys.
- `backend/src/main/java/com/dev/resume_screener/exception/GlobalExceptionHandler.java` updated to return clean JSON errors for resume validation, multipart failures, unsupported media types, and existing auth/job flows without exposing stack traces.
- Resume module created under `backend/src/main/java/com/dev/resume_screener/resume/`:
- `Resume.java`: `resumes` entity with fields `id`, `fileName`, `contentType`, `fileSize`, `extractedText`, and `uploadedAt`.
- `Candidate.java`: `candidates` entity with fields `id`, `job`, `resume`, `candidateName`, `email`, `aiScore`, `matchedSkills`, `missingSkills`, `aiExplanation`, `screenedAt`, and `createdAt`.
- `ResumeRepository.java`: JPA repository for stored parsed resumes.
- `CandidateRepository.java`: JPA repository for job-linked candidate rows with `findByJobOrderByCreatedAtDesc(...)` and `deleteAllByJob(...)`.
- `PDFParserService.java`: parses uploaded PDFs in memory with PDFBox, normalizes whitespace, rejects protected/corrupted/no-text PDFs, and never logs extracted text.
- `ResumePersistenceService.java`: persists each successful file inside its own `REQUIRES_NEW` transaction so one failed file does not roll back the whole batch.
- `ResumeService.java`: validates the batch, enforces recruiter ownership, processes each file independently, stores parsed resumes, creates candidate links, and lists uploaded resumes for a job.
- `ResumeController.java`: exposes protected upload and list endpoints under the existing job route.
- `ResumeUploadItemResponse.java`, `ResumeUploadResponse.java`, and `JobResumeResponse.java`: DTOs for upload results and job resume listing.
- `ResumeValidationException.java` and `ResumeParseException.java`: resume-specific controlled failures used for frontend-friendly messages.
- Resume entity/table details:
- Table: `resumes`
- Columns: `id`, `file_name`, `content_type`, `file_size`, `extracted_text`, `uploaded_at`
- `file_name` is required.
- `extracted_text` uses `TEXT`.
- `uploaded_at` is set automatically in `@PrePersist`.
- Candidate entity/table details:
- Table: `candidates`
- Relationships: `Candidate -> Job` via `job_id` and `Candidate -> Resume` via unique `resume_id`.
- `aiScore`, `matchedSkills`, `missingSkills`, `aiExplanation`, and `screenedAt` remain `null` for Module 4.
- Uniqueness is enforced by a unique `resume_id` and a unique `(job_id, resume_id)` constraint.
- Final backend endpoints:
- `POST /api/jobs/{jobId}/resumes`
- Multipart field name: `files`
- `GET /api/jobs/{jobId}/resumes`
- Resume deletion endpoint was intentionally deferred and not implemented in Module 4.
- File validation rules implemented in the backend:
- maximum `20` files per request
- maximum `10 MB` per file
- empty files rejected
- missing filenames rejected
- file extension must be `.pdf`
- content type must be compatible with PDF, with empty or `application/octet-stream` tolerated for browser/client variability
- filename is sanitized before storage and path traversal-style path segments are stripped
- PDF parsing behavior implemented:
- parsing uses `Loader.loadPDF(file.getBytes())` so files stay in memory and are not persisted to disk
- password-protected PDFs return `The PDF is password protected.`
- corrupted/unreadable PDFs return `The PDF could not be read. Please upload a valid PDF file.`
- PDFs with no extractable text return `The PDF does not contain extractable text.`
- obvious whitespace is normalized while preserving readable line breaks
- Batch partial-success behavior implemented:
- batch-level validation runs once
- each file is validated and parsed independently
- each successful file is stored in its own transaction through `ResumePersistenceService`
- upload response returns a per-file status row with success or failure instead of aborting the full batch
- Upload response DTO shape returned by the backend:
- top-level fields: `jobId`, `totalFiles`, `successfulCount`, `failedCount`, `results`
- per-file fields: `originalFileName`, `resumeId`, `candidateId`, `status`, `message`
- Recruiter ownership enforcement:
- `CurrentUserService` resolves the authenticated recruiter from Spring Security
- `ResumeService` loads the target job only through `jobRepository.findByIdAndCreatedBy(jobId, currentUser)`
- list and upload calls both use the owned job lookup, so one recruiter cannot upload to or read another recruiter’s job resumes
- Backend tests added:
- `backend/src/test/java/com/dev/resume_screener/resume/PDFParserServiceTest.java`
- `backend/src/test/java/com/dev/resume_screener/resume/ResumeServiceTest.java`
- `backend/src/test/java/com/dev/resume_screener/resume/ResumeControllerTest.java`
- `backend/src/test/java/com/dev/resume_screener/job/JobServiceTest.java` updated for the shared current-user service.
- Frontend files created:
- `frontend/src/api/resumes.js`: Axios client for upload/list resume calls using the existing JWT interceptor.
- `frontend/src/components/resumes/ResumeUploadZone.jsx`: drag-and-drop plus browse upload surface.
- `frontend/src/components/resumes/SelectedResumeList.jsx`: pre-upload and post-upload selected file list with statuses, retry, clear, and upload actions.
- `frontend/src/components/resumes/UploadedResumeList.jsx`: uploaded resumes section with loading, error, and empty states.
- `frontend/src/components/resumes/ResumeStatusBadge.jsx`: consistent resume status badge rendering.
- Frontend files modified:
- `frontend/src/pages/JobDetail.jsx`: replaced the placeholder with the live Module 4 recruiter flow while preserving the existing layout, back navigation, job details, and delete-job behavior.
- Job detail integration details:
- recruiters can drag and drop or browse multiple PDFs
- duplicate file selection is prevented using `name + size + lastModified`
- invalid client-side selections are rejected immediately with recruiter-friendly feedback
- selected files show filename, size, status, and remove action
- upload supports retrying only failed files
- overall progress is shown during the network upload
- per-file states are shown as `Ready`, `Uploading`, `Processing`, `Uploaded`, or `Failed`
- uploaded resumes are reloaded after a successful upload and shown with `Ready for screening` or `Screened`
- extracted resume text is not shown in the UI
- Screen Candidates placeholder behavior:
- the button appears in the sidebar card
- it stays disabled until at least one resume is uploaded
- it does not call Gemini or any screening endpoint yet
- helper copy explains that analysis will be available in the next workflow step
- Commands actually run and results:
- `backend\mvnw.cmd test` with the default Maven cache initially failed because the sandbox could not write to `C:\Users\Dev\.m2\repository`.
- `backend\mvnw.cmd '-Dmaven.repo.local=.m2' test` passed after using a workspace-local Maven repository.
- `backend\mvnw.cmd '-Dmaven.repo.local=.m2' clean test` passed.
- `frontend\npm run lint` initially failed on `frontend/src/api/resumes.js` because thrown `Error` objects lacked `cause`; after fixing that, `frontend\npm run lint` passed.
- `frontend\npm run build` failed inside the sandbox with Vite `spawn EPERM` from `vite.config.js` resolution.
- `frontend\npm run build` passed when rerun unsandboxed outside the sandbox restriction.

### Key Design Decisions
- PDFs are parsed in memory with `MultipartFile.getBytes()` and PDFBox because resumes contain personal information and this flow does not need filesystem persistence.
- Raw PDF files are not stored in PostgreSQL; only metadata plus extracted text are stored because Module 4 only needs parsed text and a linked candidate record.
- Extracted resume text is not returned in `GET /api/jobs/{jobId}/resumes` because the text can be large and may contain sensitive personal data.
- Filename sanitization removes directory segments, strips unsafe characters, and falls back to `resume.pdf` when the sanitized result would otherwise be blank.
- Partial batch success is preserved by saving each valid file inside `ResumePersistenceService.saveParsedResume(...)` with `REQUIRES_NEW` transaction propagation.
- Candidate rows are created immediately for each successfully parsed resume so Module 5 can enrich the existing records instead of recreating linkage later.
- Authenticated recruiter ownership is checked at the service layer through `CurrentUserService` plus `jobRepository.findByIdAndCreatedBy(...)`, matching the ownership style already used in the job module.
- Frontend upload progress is intentionally an overall request progress bar only; per-file processing states come from local state plus the final backend response because one multipart batch request does not expose precise independent per-file network progress.
- The endpoint shape uses `/api/jobs/{jobId}/resumes` because the relationship to the current job detail page is explicit and it avoids inventing a separate upload endpoint style.
- Changes outside the resume module were intentionally minimal:
- `JobService` changed only to reuse the new current-user helper and clean up linked resume data on job deletion.
- `GlobalExceptionHandler` changed only to add safe resume/multipart error responses while preserving the existing JSON error shape.
- `JobDetail.jsx` changed only to replace the placeholder with the real upload flow while preserving the existing page structure and recruiter-facing design language.

### Known Issues / Watch-outs
- Password-protected PDFs are rejected with a controlled per-file error and are not parsed.
- Image-only or scanned PDFs without extractable text are rejected because Module 4 does not include OCR.
- PDFBox tests emit a warning in this environment because the process cannot write `C:\Users\Dev\.pdfbox.cache`; parsing still worked and both backend test commands passed.
- Frontend production build inside the sandbox still triggers a Windows `spawn EPERM`; the unsandboxed retry succeeded, so this is an environment limitation rather than an application code failure.
- Unauthenticated protected requests currently redirect to login with HTTP `302` in controller tests rather than returning a JSON `401`, which matches the current security behavior and test expectations in this environment.
- Resume deletion was deferred in Module 4 and no delete button is shown for uploaded resumes.
- Manual browser-based end-to-end testing was not executed in this pass; verification here is command-based plus test-based.

### What Module 5 Will Find Ready
- Authenticated recruiters can upload multiple PDF resumes to a specific job.
- Resume PDFs are validated and parsed with PDFBox.
- Extracted resume text is stored in the `resumes` table.
- Candidate rows are created and linked to both `Job` and `Resume`.
- `aiScore`, `matchedSkills`, `missingSkills`, `aiExplanation`, and `screenedAt` are intentionally still `null`.
- Job detail now displays uploaded resumes and exposes the `Screen Candidates` action placeholder.
- Module 5 should reuse:
- `backend/src/main/java/com/dev/resume_screener/resume/ResumeService.java`
- `backend/src/main/java/com/dev/resume_screener/resume/PDFParserService.java`
- `backend/src/main/java/com/dev/resume_screener/resume/CandidateRepository.java`
- `backend/src/main/java/com/dev/resume_screener/resume/ResumeRepository.java`
- `POST /api/jobs/{jobId}/resumes`
- `GET /api/jobs/{jobId}/resumes`
- Gemini screening input should come from `Resume.extractedText` and job context from the existing `Job` entity fields (`title`, `description`, `requiredSkills`).
- Module 5 should preserve the current per-file batch behavior because recruiters can upload mixed-quality files in one request and successful uploads already persist independently.