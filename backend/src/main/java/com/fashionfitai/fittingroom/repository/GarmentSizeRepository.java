package com.fashionfitai.fittingroom.repository;

import com.fashionfitai.fittingroom.entity.GarmentSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GarmentSizeRepository extends JpaRepository<GarmentSize, Long> {

    List<GarmentSize> findByGarmentId(Long garmentId);
}
