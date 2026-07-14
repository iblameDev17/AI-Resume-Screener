package com.dev.resume_screener.job;

import java.util.List;
import java.util.Optional;

import com.dev.resume_screener.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    Optional<Job> findByIdAndCreatedBy(Long id, User createdBy);
}
