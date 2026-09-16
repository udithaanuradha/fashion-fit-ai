package com.fashionfitai.fittingroom.dto;

public record GarmentSizeResponse(
        String sizeLabel,
        double chestMinCm,
        double chestMaxCm,
        double waistMinCm,
        double waistMaxCm,
        double hipsMinCm,
        double hipsMaxCm
) {
}
