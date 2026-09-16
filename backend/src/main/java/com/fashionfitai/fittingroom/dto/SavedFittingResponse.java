package com.fashionfitai.fittingroom.dto;

import java.time.Instant;

public record SavedFittingResponse(
        Long id,
        Long garmentId,
        String garmentName,
        String recommendedSize,
        int fitScore,
        Instant createdAt
) {
}
