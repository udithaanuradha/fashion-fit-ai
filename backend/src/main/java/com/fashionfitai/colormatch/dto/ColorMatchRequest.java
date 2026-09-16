package com.fashionfitai.colormatch.dto;

import com.fashionfitai.colormatch.model.Undertone;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ColorMatchRequest(
        @NotNull
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "skinToneHex must be a hex color like #E0AC69")
        String skinToneHex,

        @NotNull Undertone undertone
) {
}
