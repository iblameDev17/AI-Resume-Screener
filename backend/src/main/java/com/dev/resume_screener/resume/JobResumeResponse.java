package com.dev.resume_screener.resume;

import java.time.LocalDateTime;

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
public class JobResumeResponse {

    private Long resumeId;
    private Long candidateId;
    private String fileName;
    private String candidateName;
    private LocalDateTime uploadedAt;
    private String status;
    private boolean screened;
}
