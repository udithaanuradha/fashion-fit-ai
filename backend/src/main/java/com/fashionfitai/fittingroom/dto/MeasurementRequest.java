package com.fashionfitai.fittingroom.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record MeasurementRequest(
        @NotNull @DecimalMin(value = "50.0", message = "heightCm looks too small") Double heightCm,
        @NotNull @DecimalMin(value = "20.0", message = "weightKg looks too small") Double weightKg,
        @NotNull @DecimalMin(value = "30.0", message = "chestCm looks too small") Double chestCm,
        @NotNull @DecimalMin(value = "30.0", message = "waistCm looks too small") Double waistCm,
        @NotNull @DecimalMin(value = "30.0", message = "hipsCm looks too small") Double hipsCm
) {
}
