package com.fashionfitai.colormatch.dto;

import com.fashionfitai.colormatch.model.Season;
import com.fashionfitai.colormatch.model.Undertone;

import java.time.Instant;

public record ColorProfileResponse(
        Long id,
        String skinToneHex,
        Undertone undertone,
        Season season,
        Instant createdAt
) {
}
