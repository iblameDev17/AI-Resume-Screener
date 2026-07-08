package com.dev.resume_screener.exception;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path) {
}
