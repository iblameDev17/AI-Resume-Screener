package com.dev.resume_screener.resume;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.dev.resume_screener.job.Job;
import com.dev.resume_screener.job.JobRepository;
import com.dev.resume_screener.user.CurrentUserService;
import com.dev.resume_screener.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private PDFParserService pdfParserService;

    @Mock
    private ResumePersistenceService resumePersistenceService;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private ResumeService resumeService;

    @Test
    void shouldAllowRecruiterToUploadToOwnJob() {
        User recruiter = recruiter();
        Job job = job(recruiter);
        MockMultipartFile file = pdfFile("candidate.pdf", 1024);

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));
        when(pdfParserService.extractText(file)).thenReturn("Experienced Java engineer");
        when(resumePersistenceService.saveParsedResume(any(), any(), any(), any(Long.class), any(), any()))
                .thenReturn(ResumeUploadItemResponse.builder()
                        .originalFileName("candidate.pdf")
                        .resumeId(5L)
                        .candidateId(9L)
                        .status("SUCCESS")
                        .message("Resume uploaded and parsed successfully.")
                        .build());

        ResumeUploadResponse response = resumeService.uploadResumes(10L, List.of(file));

        assertThat(response.getSuccessfulCount()).isEqualTo(1);
        assertThat(response.getFailedCount()).isEqualTo(0);
        assertThat(response.getResults().get(0).getResumeId()).isEqualTo(5L);
    }

    @Test
    void shouldRejectUploadToAnotherRecruitersJob() {
        User recruiter = recruiter();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resumeService.uploadResumes(10L, List.of(pdfFile("candidate.pdf", 1024))))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("Job not found.");
    }

    @Test
    void shouldPreserveSuccessfulUploadsWhenOneFileFails() {
        User recruiter = recruiter();
        Job job = job(recruiter);
        MockMultipartFile validFile = pdfFile("valid.pdf", 1024);
        MockMultipartFile brokenFile = pdfFile("broken.pdf", 1024);

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));
        when(pdfParserService.extractText(validFile)).thenReturn("Useful text");
        when(pdfParserService.extractText(brokenFile)).thenThrow(new ResumeParseException("The PDF could not be read. Please upload a valid PDF file.", new RuntimeException()));
        when(resumePersistenceService.saveParsedResume(any(), any(), any(), any(Long.class), any(), any()))
                .thenReturn(ResumeUploadItemResponse.builder()
                        .originalFileName("valid.pdf")
                        .resumeId(6L)
                        .candidateId(8L)
                        .status("SUCCESS")
                        .message("Resume uploaded and parsed successfully.")
                        .build());

        ResumeUploadResponse response = resumeService.uploadResumes(10L, List.of(validFile, brokenFile));

        assertThat(response.getSuccessfulCount()).isEqualTo(1);
        assertThat(response.getFailedCount()).isEqualTo(1);
        assertThat(response.getResults()).extracting(ResumeUploadItemResponse::getStatus).containsExactly("SUCCESS", "FAILED");
    }

    @Test
    void shouldListOnlyUploadedResumesForJob() {
        User recruiter = recruiter();
        Job job = job(recruiter);
        Resume resume = Resume.builder()
                .id(7L)
                .fileName("candidate.pdf")
                .contentType("application/pdf")
                .fileSize(1024L)
                .extractedText("text")
                .uploadedAt(LocalDateTime.of(2026, 7, 20, 10, 0))
                .build();
        Candidate candidate = Candidate.builder()
                .id(11L)
                .job(job)
                .resume(resume)
                .build();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));
        when(candidateRepository.findByJobOrderByCreatedAtDesc(job)).thenReturn(List.of(candidate));

        List<JobResumeResponse> resumes = resumeService.getJobResumes(10L);

        assertThat(resumes).hasSize(1);
        assertThat(resumes.get(0).getResumeId()).isEqualTo(7L);
        assertThat(resumes.get(0).getStatus()).isEqualTo("READY_FOR_SCREENING");
    }

    @Test
    void shouldRejectTooManyFiles() {
        User recruiter = recruiter();
        Job job = job(recruiter);
        List<MultipartFile> files = java.util.stream.IntStream.range(0, 21)
                .mapToObj(index -> (MultipartFile) pdfFile("candidate-" + index + ".pdf", 1024))
                .toList();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> resumeService.uploadResumes(10L, files))
                .isInstanceOf(ResumeValidationException.class)
                .hasMessage("You can upload up to 20 resumes at a time.");
    }

    @Test
    void shouldRejectEmptyAndNonPdfFiles() {
        User recruiter = recruiter();
        Job job = job(recruiter);

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));

        ResumeUploadResponse emptyResponse = resumeService.uploadResumes(10L, List.of(new MockMultipartFile("files", "empty.pdf", "application/pdf", new byte[0])));
        ResumeUploadResponse txtResponse = resumeService.uploadResumes(10L, List.of(new MockMultipartFile("files", "notes.txt", "text/plain", "hello".getBytes())));

        assertThat(emptyResponse.getFailedCount()).isEqualTo(1);
        assertThat(emptyResponse.getResults().get(0).getMessage()).isEqualTo("Empty files cannot be uploaded.");
        assertThat(txtResponse.getFailedCount()).isEqualTo(1);
        assertThat(txtResponse.getResults().get(0).getMessage()).isEqualTo("Only PDF resumes are supported.");
    }

    @Test
    void shouldRejectOversizedFile() {
        User recruiter = recruiter();
        Job job = job(recruiter);
        MockMultipartFile largeFile = pdfFile("large.pdf", ResumeService.MAX_FILE_SIZE_BYTES + 1);

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(10L, recruiter)).thenReturn(Optional.of(job));

        ResumeUploadResponse response = resumeService.uploadResumes(10L, List.of(largeFile));

        assertThat(response.getFailedCount()).isEqualTo(1);
        assertThat(response.getResults().get(0).getMessage()).isEqualTo("Each resume must be 10 MB or smaller.");
    }

    private MockMultipartFile pdfFile(String name, long size) {
        return new MockMultipartFile("files", name, "application/pdf", new byte[(int) size]);
    }

    private User recruiter() {
        return User.builder()
                .id(1L)
                .email("recruiter@example.com")
                .name("Recruiter")
                .provider("LOCAL")
                .role("RECRUITER")
                .build();
    }

    private Job job(User recruiter) {
        return Job.builder()
                .id(10L)
                .title("Java Engineer")
                .description("Build screening workflows")
                .createdBy(recruiter)
                .build();
    }
}
