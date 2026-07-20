package com.dev.resume_screener.resume;

import java.util.List;

import com.dev.resume_screener.job.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByJobOrderByCreatedAtDesc(Job job);

    void deleteAllByJob(Job job);
}
