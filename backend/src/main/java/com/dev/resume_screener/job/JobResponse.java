package com.dev.resume_screener.job;

import java.time.LocalDateTime;
import java.util.List;

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
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private LocalDateTime createdAt;
    private List<String> requiredSkillsList;
    private Integer requiredSkillsCount;
}
