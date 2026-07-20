package com.dev.resume_screener.job;

import java.util.Arrays;
import java.util.List;

import com.dev.resume_screener.resume.CandidateRepository;
import com.dev.resume_screener.resume.Resume;
import com.dev.resume_screener.resume.ResumeRepository;
import com.dev.resume_screener.user.CurrentUserService;
import com.dev.resume_screener.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CurrentUserService currentUserService;
    private final CandidateRepository candidateRepository;
    private final ResumeRepository resumeRepository;

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Job job = Job.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .requiredSkills(normalizeRequiredSkills(request.getRequiredSkills()))
                .createdBy(currentUser)
                .build();

        return toResponse(jobRepository.save(job));
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs() {
        return jobRepository.findByCreatedByOrderByCreatedAtDesc(currentUserService.getCurrentUser())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        Job job = jobRepository.findByIdAndCreatedBy(id, currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("Job not found."));
        return toResponse(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        Job job = jobRepository.findByIdAndCreatedBy(id, currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("Job not found."));

        List<Resume> resumes = candidateRepository.findByJobOrderByCreatedAtDesc(job)
                .stream()
                .map(candidate -> candidate.getResume())
                .toList();

        candidateRepository.deleteAllByJob(job);
        if (!resumes.isEmpty()) {
            resumeRepository.deleteAll(resumes);
        }
        jobRepository.delete(job);
    }

    private JobResponse toResponse(Job job) {
        List<String> requiredSkillsList = parseRequiredSkills(job.getRequiredSkills());

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .createdAt(job.getCreatedAt())
                .requiredSkillsList(requiredSkillsList)
                .requiredSkillsCount(requiredSkillsList.size())
                .build();
    }

    private String normalizeRequiredSkills(String requiredSkills) {
        List<String> normalizedSkills = parseRequiredSkills(requiredSkills);
        return normalizedSkills.isEmpty() ? null : String.join(", ", normalizedSkills);
    }

    private List<String> parseRequiredSkills(String requiredSkills) {
        if (!StringUtils.hasText(requiredSkills)) {
            return List.of();
        }

        return Arrays.stream(requiredSkills.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }
}
