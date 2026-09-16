package com.fashionfitai.fittingroom.repository;

import com.fashionfitai.fittingroom.entity.BodyMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BodyMeasurementRepository extends JpaRepository<BodyMeasurement, Long> {

    Optional<BodyMeasurement> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
