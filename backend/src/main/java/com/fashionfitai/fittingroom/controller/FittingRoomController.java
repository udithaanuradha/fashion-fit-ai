package com.fashionfitai.fittingroom.controller;

import com.fashionfitai.auth.entity.User;
import com.fashionfitai.common.dto.ApiResponse;
import com.fashionfitai.fittingroom.dto.BodyMeasurementResponse;
import com.fashionfitai.fittingroom.dto.FitRecommendationResponse;
import com.fashionfitai.fittingroom.dto.GarmentResponse;
import com.fashionfitai.fittingroom.dto.MeasurementRequest;
import com.fashionfitai.fittingroom.dto.SavedFittingResponse;
import com.fashionfitai.fittingroom.service.FittingRoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fittingroom")
public class FittingRoomController {

    private final FittingRoomService fittingRoomService;

    public FittingRoomController(FittingRoomService fittingRoomService) {
        this.fittingRoomService = fittingRoomService;
    }

    @PostMapping("/measurements")
    public ResponseEntity<ApiResponse<BodyMeasurementResponse>> saveMeasurement(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MeasurementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(fittingRoomService.saveMeasurement(user, request)));
    }

    @GetMapping("/measurements/latest")
    public ResponseEntity<ApiResponse<BodyMeasurementResponse>> latestMeasurement(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(fittingRoomService.latestMeasurement(user.getId())));
    }

    @GetMapping("/garments")
    public ResponseEntity<ApiResponse<List<GarmentResponse>>> listGarments() {
        return ResponseEntity.ok(ApiResponse.success(fittingRoomService.listGarments()));
    }

    @GetMapping("/recommend/{garmentId}")
    public ResponseEntity<ApiResponse<FitRecommendationResponse>> recommend(
            @AuthenticationPrincipal User user,
            @PathVariable @NonNull Long garmentId) {
        return ResponseEntity.ok(ApiResponse.success(fittingRoomService.recommend(user, garmentId)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<SavedFittingResponse>>> history(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(fittingRoomService.history(user.getId())));
    }
}
