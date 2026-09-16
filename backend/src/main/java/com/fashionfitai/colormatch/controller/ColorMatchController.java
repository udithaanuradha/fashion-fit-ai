package com.fashionfitai.colormatch.controller;

import com.fashionfitai.auth.entity.User;
import com.fashionfitai.colormatch.dto.ColorMatchRequest;
import com.fashionfitai.colormatch.dto.ColorMatchResponse;
import com.fashionfitai.colormatch.dto.ColorProfileResponse;
import com.fashionfitai.colormatch.service.ColorMatchService;
import com.fashionfitai.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/colormatch")
public class ColorMatchController {

    private final ColorMatchService colorMatchService;

    public ColorMatchController(ColorMatchService colorMatchService) {
        this.colorMatchService = colorMatchService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<ColorMatchResponse>> analyze(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ColorMatchRequest request) {
        ColorMatchResponse response = colorMatchService.analyze(user, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ColorProfileResponse>>> history(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(colorMatchService.history(user.getId())));
    }
}
