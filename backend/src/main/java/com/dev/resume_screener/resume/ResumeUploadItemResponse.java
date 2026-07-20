package com.dev.resume_screener.resume;

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
public class ResumeUploadItemResponse {

    private String originalFileName;
    private Long resumeId;
    private Long candidateId;
    private String status;
    private String message;
}
