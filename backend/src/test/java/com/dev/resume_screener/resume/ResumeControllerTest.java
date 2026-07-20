package com.dev.resume_screener.resume;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import com.dev.resume_screener.ResumeScreenerApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = ResumeScreenerApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResumeService resumeService;

    @Test
    void uploadEndpointShouldRequireAuthentication() throws Exception {
        MockMultipartFile file = new MockMultipartFile("files", "candidate.pdf", "application/pdf", "pdf".getBytes());

        mockMvc.perform(multipart("/api/jobs/10/resumes").file(file))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    void uploadEndpointShouldReturnPerFileStatus() throws Exception {
        MockMultipartFile file = new MockMultipartFile("files", "candidate.pdf", "application/pdf", "pdf".getBytes());
        when(resumeService.uploadResumes(org.mockito.ArgumentMatchers.eq(10L), org.mockito.ArgumentMatchers.anyList()))
                .thenReturn(ResumeUploadResponse.builder()
                        .jobId(10L)
                        .totalFiles(1)
                        .successfulCount(1)
                        .failedCount(0)
                        .results(List.of(ResumeUploadItemResponse.builder()
                                .originalFileName("candidate.pdf")
                                .resumeId(5L)
                                .candidateId(7L)
                                .status("SUCCESS")
                                .message("Resume uploaded and parsed successfully.")
                                .build()))
                        .build());

        mockMvc.perform(multipart("/api/jobs/10/resumes")
                        .file(file)
                        .with(user("recruiter@example.com")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.successfulCount").value(1))
                .andExpect(jsonPath("$.results[0].status").value("SUCCESS"));
    }

    @Test
    void listEndpointShouldReturnUploadedResumes() throws Exception {
        when(resumeService.getJobResumes(10L)).thenReturn(List.of(
                JobResumeResponse.builder()
                        .resumeId(5L)
                        .candidateId(7L)
                        .fileName("candidate.pdf")
                        .uploadedAt(LocalDateTime.of(2026, 7, 20, 11, 0))
                        .status("READY_FOR_SCREENING")
                        .screened(false)
                        .build()));

        mockMvc.perform(get("/api/jobs/10/resumes").with(user("recruiter@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fileName").value("candidate.pdf"))
                .andExpect(jsonPath("$[0].status").value("READY_FOR_SCREENING"));
    }
}
