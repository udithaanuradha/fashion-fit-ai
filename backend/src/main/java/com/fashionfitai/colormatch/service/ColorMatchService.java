package com.fashionfitai.colormatch.service;

import com.fashionfitai.auth.entity.User;
import com.fashionfitai.colormatch.dto.ColorMatchRequest;
import com.fashionfitai.colormatch.dto.ColorMatchResponse;
import com.fashionfitai.colormatch.dto.ColorProfileResponse;
import com.fashionfitai.colormatch.entity.ColorProfile;
import com.fashionfitai.colormatch.model.Season;
import com.fashionfitai.colormatch.model.Undertone;
import com.fashionfitai.colormatch.repository.ColorProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ColorMatchService {

    private static final int BRIGHTNESS_THRESHOLD = 140;

    private static final Map<Season, List<String>> RECOMMENDED_COLORS = Map.of(
            Season.SPRING, List.of("#FF7F50", "#FFD700", "#40E0D0", "#98FB98", "#FF6F61"),
            Season.SUMMER, List.of("#B0C4DE", "#E6E6FA", "#F7CAC9", "#A9A9A9", "#8FBC8F"),
            Season.AUTUMN, List.of("#B7410E", "#808000", "#FFDB58", "#E2725B", "#654321"),
            Season.WINTER, List.of("#C41E3A", "#008B45", "#4169E1", "#000000", "#FFFFFF")
    );

    private static final Map<Season, List<String>> COLORS_TO_AVOID = Map.of(
            Season.SPRING, List.of("#000000", "#C0C0C0", "#B0E0E6"),
            Season.SUMMER, List.of("#FFA500", "#FFD700", "#000000"),
            Season.AUTUMN, List.of("#ADD8E6", "#FF00FF", "#FFFFFF"),
            Season.WINTER, List.of("#FFA500", "#F5DEB3", "#D2B48C")
    );

    private final ColorProfileRepository colorProfileRepository;

    public ColorMatchService(ColorProfileRepository colorProfileRepository) {
        this.colorProfileRepository = colorProfileRepository;
    }

    public ColorMatchResponse analyze(User user, ColorMatchRequest request) {
        Season season = determineSeason(request.skinToneHex(), request.undertone());

        colorProfileRepository.save(new ColorProfile(user, request.skinToneHex(), request.undertone(), season));

        return new ColorMatchResponse(season, RECOMMENDED_COLORS.get(season), COLORS_TO_AVOID.get(season));
    }

    public List<ColorProfileResponse> history(Long userId) {
        return colorProfileRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(p -> new ColorProfileResponse(p.getId(), p.getSkinToneHex(), p.getUndertone(), p.getSeason(), p.getCreatedAt()))
                .toList();
    }

    private Season determineSeason(String hex, Undertone undertone) {
        int brightness = relativeBrightness(hex);
        boolean isLight = brightness >= BRIGHTNESS_THRESHOLD;

        return switch (undertone) {
            case WARM -> isLight ? Season.SPRING : Season.AUTUMN;
            case COOL -> isLight ? Season.SUMMER : Season.WINTER;
            case NEUTRAL -> isLight ? Season.SUMMER : Season.AUTUMN;
        };
    }

    private int relativeBrightness(String hex) {
        int r = Integer.parseInt(hex.substring(1, 3), 16);
        int g = Integer.parseInt(hex.substring(3, 5), 16);
        int b = Integer.parseInt(hex.substring(5, 7), 16);
        return (int) (0.299 * r + 0.587 * g + 0.114 * b);
    }
}
