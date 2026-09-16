package com.fashionfitai.fittingroom.dto;

import java.time.Instant;

public record BodyMeasurementResponse(
        Long id,
        double heightCm,
        double weightKg,
        double chestCm,
        double waistCm,
        double hipsCm,
        Instant createdAt
) {
}
