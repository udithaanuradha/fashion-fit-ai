package com.fashionfitai.fittingroom.dto;

public record FitRecommendationResponse(
        Long garmentId,
        String garmentName,
        String recommendedSize,
        int fitScore,
        String notes
) {
}
