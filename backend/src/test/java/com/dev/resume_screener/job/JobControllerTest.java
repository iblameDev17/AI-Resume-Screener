package com.dev.resume_screener.job;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import com.dev.resume_screener.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class JobControllerTest {

    @Mock
    private JobService jobService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        mockMvc = MockMvcBuilders.standaloneSetup(new JobController(jobService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldReturnCurrentUsersJobs() throws Exception {
        when(jobService.getMyJobs()).thenReturn(List.of(buildResponse()));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Senior Backend Engineer"));
    }

    @Test
    void shouldCreateJob() throws Exception {
        when(jobService.createJob(any(JobRequest.class))).thenReturn(buildResponse());

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(JobRequest.builder()
                                .title("Senior Backend Engineer")
                                .description("Own the jobs service.")
                                .requiredSkills("Java, Spring Boot")
                                .build())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.requiredSkillsCount").value(2));
    }

    @Test
    void shouldReturnJobDetail() throws Exception {
        when(jobService.getJobById(5L)).thenReturn(buildResponse());

        mockMvc.perform(get("/api/jobs/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    void shouldDeleteJob() throws Exception {
        doNothing().when(jobService).deleteJob(5L);

        mockMvc.perform(delete("/api/jobs/5"))
                .andExpect(status().isNoContent());
    }

    private JobResponse buildResponse() {
        return JobResponse.builder()
                .id(5L)
                .title("Senior Backend Engineer")
                .description("Own the jobs service.")
                .requiredSkills("Java, Spring Boot")
                .requiredSkillsList(List.of("Java", "Spring Boot"))
                .requiredSkillsCount(2)
                .createdAt(LocalDateTime.of(2026, 7, 15, 11, 0))
                .build();
    }
}
