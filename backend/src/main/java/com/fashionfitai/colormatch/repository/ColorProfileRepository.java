package com.fashionfitai.colormatch.repository;

import com.fashionfitai.colormatch.entity.ColorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ColorProfileRepository extends JpaRepository<ColorProfile, Long> {

    List<ColorProfile> findByUserIdOrderByCreatedAtDesc(Long userId);
}
