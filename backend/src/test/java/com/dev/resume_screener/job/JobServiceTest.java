package com.dev.resume_screener.job;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.dev.resume_screener.resume.CandidateRepository;
import com.dev.resume_screener.resume.ResumeRepository;
import com.dev.resume_screener.user.CurrentUserService;
import com.dev.resume_screener.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private ResumeRepository resumeRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void createJobShouldNormalizeSkillsAndMapResponse() {
        User recruiter = buildRecruiter();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> {
            Job job = invocation.getArgument(0);
            job.setId(42L);
            job.setCreatedAt(LocalDateTime.of(2026, 7, 15, 10, 30));
            return job;
        });

        JobResponse response = jobService.createJob(JobRequest.builder()
                .title("  Senior Java Engineer  ")
                .description("  Build hiring workflows.  ")
                .requiredSkills("Java, Spring Boot, Java, PostgreSQL ")
                .build());

        assertThat(response.getId()).isEqualTo(42L);
        assertThat(response.getTitle()).isEqualTo("Senior Java Engineer");
        assertThat(response.getDescription()).isEqualTo("Build hiring workflows.");
        assertThat(response.getRequiredSkills()).isEqualTo("Java, Spring Boot, PostgreSQL");
        assertThat(response.getRequiredSkillsList()).containsExactly("Java", "Spring Boot", "PostgreSQL");
        assertThat(response.getRequiredSkillsCount()).isEqualTo(3);
    }

    @Test
    void getJobByIdShouldHideJobsOwnedByOtherUsers() {
        User recruiter = buildRecruiter();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByIdAndCreatedBy(99L, recruiter)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.getJobById(99L))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("Job not found.");
    }

    @Test
    void getMyJobsShouldReturnCurrentUsersJobsOnly() {
        User recruiter = buildRecruiter();

        when(currentUserService.getCurrentUser()).thenReturn(recruiter);
        when(jobRepository.findByCreatedByOrderByCreatedAtDesc(recruiter)).thenReturn(List.of(
                Job.builder()
                        .id(7L)
                        .title("Product Designer")
                        .description("Lead recruiter collaboration.")
                        .requiredSkills("Figma, UX Research")
                        .createdBy(recruiter)
                        .createdAt(LocalDateTime.of(2026, 7, 15, 9, 0))
                        .build()));

        List<JobResponse> jobs = jobService.getMyJobs();

        assertThat(jobs).hasSize(1);
        assertThat(jobs.get(0).getRequiredSkillsList()).containsExactly("Figma", "UX Research");
    }

    private User buildRecruiter() {
        return User.builder()
                .id(1L)
                .name("Recruiter")
                .email("recruiter@example.com")
                .role("RECRUITER")
                .provider("LOCAL")
                .build();
    }
}
