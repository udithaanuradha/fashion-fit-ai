package com.fashionfitai.colormatch.dto;

import com.fashionfitai.colormatch.model.Season;

import java.util.List;

public record ColorMatchResponse(
        Season season,
        List<String> recommendedColors,
        List<String> colorsToAvoid
) {
}
