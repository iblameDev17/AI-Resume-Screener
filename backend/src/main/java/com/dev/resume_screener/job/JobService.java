package com.dev.resume_screener.job;

import java.util.Arrays;
import java.util.List;

import com.dev.resume_screener.user.User;
import com.dev.resume_screener.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User currentUser = getCurrentUser();

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
        return jobRepository.findByCreatedByOrderByCreatedAtDesc(getCurrentUser())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        User currentUser = getCurrentUser();
        Job job = jobRepository.findByIdAndCreatedBy(id, currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("Job not found."));
        return toResponse(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        User currentUser = getCurrentUser();
        Job job = jobRepository.findByIdAndCreatedBy(id, currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("Job not found."));
        jobRepository.delete(job);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UsernameNotFoundException("Authenticated user not found.");
        }

        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = authentication.getName();
        }

        if (!StringUtils.hasText(email)) {
            throw new UsernameNotFoundException("Authenticated user not found.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found."));
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
