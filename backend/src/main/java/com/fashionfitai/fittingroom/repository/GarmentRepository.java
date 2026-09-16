package com.fashionfitai.fittingroom.repository;

import com.fashionfitai.fittingroom.entity.Garment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GarmentRepository extends JpaRepository<Garment, Long> {
}
