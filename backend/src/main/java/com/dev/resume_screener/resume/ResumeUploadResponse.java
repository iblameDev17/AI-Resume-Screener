package com.dev.resume_screener.resume;

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
public class ResumeUploadResponse {

    private Long jobId;
    private int totalFiles;
    private int successfulCount;
    private int failedCount;
    private List<ResumeUploadItemResponse> results;
}
