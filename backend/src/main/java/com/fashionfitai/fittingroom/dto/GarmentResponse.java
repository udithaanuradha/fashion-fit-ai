package com.fashionfitai.fittingroom.dto;

import com.fashionfitai.fittingroom.entity.GarmentCategory;

import java.util.List;

public record GarmentResponse(
        Long id,
        String name,
        String brand,
        GarmentCategory category,
        List<GarmentSizeResponse> sizes
) {
}
