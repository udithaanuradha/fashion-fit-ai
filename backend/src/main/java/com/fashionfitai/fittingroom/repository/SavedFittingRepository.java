package com.fashionfitai.fittingroom.repository;

import com.fashionfitai.fittingroom.entity.SavedFitting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedFittingRepository extends JpaRepository<SavedFitting, Long> {

    List<SavedFitting> findByUserIdOrderByCreatedAtDesc(Long userId);
}
