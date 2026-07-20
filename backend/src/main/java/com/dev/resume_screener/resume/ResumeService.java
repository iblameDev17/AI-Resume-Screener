package com.dev.resume_screener.resume;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.dev.resume_screener.job.Job;
import com.dev.resume_screener.job.JobRepository;
import com.dev.resume_screener.user.CurrentUserService;
import com.dev.resume_screener.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ResumeService {

    public static final int MAX_FILES_PER_UPLOAD = 20;
    public static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;

    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final PDFParserService pdfParserService;
    private final ResumePersistenceService resumePersistenceService;
    private final CurrentUserService currentUserService;

    public ResumeUploadResponse uploadResumes(Long jobId, List<MultipartFile> files) {
        Job job = getOwnedJob(jobId);
        validateBatch(files);

        List<ResumeUploadItemResponse> results = new ArrayList<>();
        int successfulCount = 0;

        for (MultipartFile file : files) {
            String originalFileName = safeOriginalName(file);

            try {
                validateFile(file);
                String extractedText = pdfParserService.extractText(file);
                ResumeUploadItemResponse response = resumePersistenceService.saveParsedResume(
                        job,
                        sanitizeFileName(originalFileName),
                        normalizeContentType(file.getContentType()),
                        file.getSize(),
                        extractedText,
                        originalFileName);
                results.add(response);
                successfulCount++;
            } catch (ResumeValidationException | ResumeParseException exception) {
                results.add(ResumeUploadItemResponse.builder()
                        .originalFileName(originalFileName)
                        .status("FAILED")
                        .message(exception.getMessage())
                        .build());
            }
        }

        return ResumeUploadResponse.builder()
                .jobId(jobId)
                .totalFiles(files.size())
                .successfulCount(successfulCount)
                .failedCount(files.size() - successfulCount)
                .results(results)
                .build();
    }

    @Transactional(readOnly = true)
    public List<JobResumeResponse> getJobResumes(Long jobId) {
        Job job = getOwnedJob(jobId);
        return candidateRepository.findByJobOrderByCreatedAtDesc(job)
                .stream()
                .map(candidate -> JobResumeResponse.builder()
                        .resumeId(candidate.getResume().getId())
                        .candidateId(candidate.getId())
                        .fileName(candidate.getResume().getFileName())
                        .candidateName(candidate.getCandidateName())
                        .uploadedAt(candidate.getResume().getUploadedAt())
                        .status(candidate.getAiScore() == null ? "READY_FOR_SCREENING" : "SCREENED")
                        .screened(candidate.getAiScore() != null)
                        .build())
                .toList();
    }

    private Job getOwnedJob(Long jobId) {
        User currentUser = currentUserService.getCurrentUser();
        return jobRepository.findByIdAndCreatedBy(jobId, currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("Job not found."));
    }

    private void validateBatch(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ResumeValidationException("Add at least one PDF resume before uploading.");
        }

        if (files.size() > MAX_FILES_PER_UPLOAD) {
            throw new ResumeValidationException("You can upload up to 20 resumes at a time.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null) {
            throw new ResumeValidationException("One of the selected files is missing.");
        }

        String originalFileName = safeOriginalName(file);
        if (!StringUtils.hasText(originalFileName)) {
            throw new ResumeValidationException("One of the selected files is missing a filename.");
        }

        if (file.isEmpty() || file.getSize() == 0) {
            throw new ResumeValidationException("Empty files cannot be uploaded.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResumeValidationException("Each resume must be 10 MB or smaller.");
        }

        String lowerName = originalFileName.toLowerCase(Locale.ROOT);
        String normalizedContentType = normalizeContentType(file.getContentType());
        boolean isPdfExtension = lowerName.endsWith(".pdf");
        boolean isPdfContentType = normalizedContentType.isBlank()
                || "application/pdf".equals(normalizedContentType)
                || "application/x-pdf".equals(normalizedContentType)
                || "application/octet-stream".equals(normalizedContentType);

        if (!isPdfExtension || !isPdfContentType) {
            throw new ResumeValidationException("Only PDF resumes are supported.");
        }
    }

    static String sanitizeFileName(String originalFileName) {
        String fileName = originalFileName.replace('\\', '/');
        int lastSlash = fileName.lastIndexOf('/');
        if (lastSlash >= 0) {
            fileName = fileName.substring(lastSlash + 1);
        }

        String sanitized = fileName.replaceAll("[^A-Za-z0-9._ -]", "_").trim();
        if (!StringUtils.hasText(sanitized)) {
            sanitized = "resume.pdf";
        }

        return sanitized.length() > 255 ? sanitized.substring(0, 255) : sanitized;
    }

    private String safeOriginalName(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        return StringUtils.hasText(originalName) ? originalName.trim() : "unnamed.pdf";
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? "" : contentType.trim().toLowerCase(Locale.ROOT);
    }
}
