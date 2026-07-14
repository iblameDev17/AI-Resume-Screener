package com.dev.resume_screener.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {

    @NotBlank(message = "Job title is required.")
    @Size(max = 200, message = "Job title must be 200 characters or fewer.")
    private String title;

    @NotBlank(message = "Job description is required.")
    private String description;

    @Size(max = 5000, message = "Required skills must be 5000 characters or fewer.")
    private String requiredSkills;
}
