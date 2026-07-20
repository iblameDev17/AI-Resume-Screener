package com.dev.resume_screener.resume;

import com.dev.resume_screener.job.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResumePersistenceService {

    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ResumeUploadItemResponse saveParsedResume(
            Job job,
            String sanitizedFileName,
            String contentType,
            long fileSize,
            String extractedText,
            String originalFileName) {
        Resume resume = resumeRepository.save(Resume.builder()
                .fileName(sanitizedFileName)
                .contentType(contentType)
                .fileSize(fileSize)
                .extractedText(extractedText)
                .build());

        Candidate candidate = candidateRepository.save(Candidate.builder()
                .job(job)
                .resume(resume)
                .build());

        return ResumeUploadItemResponse.builder()
                .originalFileName(originalFileName)
                .resumeId(resume.getId())
                .candidateId(candidate.getId())
                .status("SUCCESS")
                .message("Resume uploaded and parsed successfully.")
                .build();
    }
}
