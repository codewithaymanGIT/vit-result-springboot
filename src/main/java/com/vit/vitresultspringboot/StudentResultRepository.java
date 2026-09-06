package com.vit.vitresultspringboot;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
}