package com.fashionfitai.fittingroom.service;

import com.fashionfitai.auth.entity.User;
import com.fashionfitai.common.exception.ApiException;
import com.fashionfitai.fittingroom.dto.BodyMeasurementResponse;
import com.fashionfitai.fittingroom.dto.FitRecommendationResponse;
import com.fashionfitai.fittingroom.dto.GarmentResponse;
import com.fashionfitai.fittingroom.dto.GarmentSizeResponse;
import com.fashionfitai.fittingroom.dto.MeasurementRequest;
import com.fashionfitai.fittingroom.dto.SavedFittingResponse;
import com.fashionfitai.fittingroom.entity.BodyMeasurement;
import com.fashionfitai.fittingroom.entity.Garment;
import com.fashionfitai.fittingroom.entity.GarmentSize;
import com.fashionfitai.fittingroom.entity.SavedFitting;
import com.fashionfitai.fittingroom.repository.BodyMeasurementRepository;
import com.fashionfitai.fittingroom.repository.GarmentRepository;
import com.fashionfitai.fittingroom.repository.GarmentSizeRepository;
import com.fashionfitai.fittingroom.repository.SavedFittingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FittingRoomService {

    private final BodyMeasurementRepository bodyMeasurementRepository;
    private final GarmentRepository garmentRepository;
    private final GarmentSizeRepository garmentSizeRepository;
    private final SavedFittingRepository savedFittingRepository;

    public FittingRoomService(BodyMeasurementRepository bodyMeasurementRepository,
                               GarmentRepository garmentRepository,
                               GarmentSizeRepository garmentSizeRepository,
                               SavedFittingRepository savedFittingRepository) {
        this.bodyMeasurementRepository = bodyMeasurementRepository;
        this.garmentRepository = garmentRepository;
        this.garmentSizeRepository = garmentSizeRepository;
        this.savedFittingRepository = savedFittingRepository;
    }

    public BodyMeasurementResponse saveMeasurement(User user, MeasurementRequest request) {
        BodyMeasurement measurement = new BodyMeasurement(
                user,
                request.heightCm(),
                request.weightKg(),
                request.chestCm(),
                request.waistCm(),
                request.hipsCm()
        );
        return toResponse(bodyMeasurementRepository.save(measurement));
    }

    public BodyMeasurementResponse latestMeasurement(Long userId) {
        return toResponse(findLatestMeasurement(userId));
    }

    public List<GarmentResponse> listGarments() {
        return garmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FitRecommendationResponse recommend(User user, @NonNull Long garmentId) {
        BodyMeasurement measurement = findLatestMeasurement(user.getId());

        Garment garment = garmentRepository.findById(garmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Garment not found"));

        List<GarmentSize> sizes = garmentSizeRepository.findByGarmentId(garmentId);
        if (sizes.isEmpty()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "This garment has no size chart yet");
        }

        GarmentSize bestSize = null;
        double bestPenalty = Double.MAX_VALUE;

        for (GarmentSize size : sizes) {
            double penalty = dimensionPenalty(measurement.getChestCm(), size.getChestMinCm(), size.getChestMaxCm())
                    + dimensionPenalty(measurement.getWaistCm(), size.getWaistMinCm(), size.getWaistMaxCm())
                    + dimensionPenalty(measurement.getHipsCm(), size.getHipsMinCm(), size.getHipsMaxCm());

            if (penalty < bestPenalty) {
                bestPenalty = penalty;
                bestSize = size;
            }
        }

        if (bestSize == null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "Unable to determine a size recommendation");
        }

        int fitScore = (int) Math.max(0, Math.round(100 - bestPenalty * 2));
        String notes = fitScore >= 90
                ? "Great fit across chest, waist and hips."
                : fitScore >= 70
                ? "Reasonable fit; check the size chart for the tightest measurement."
                : "Loose match — consider a different size or garment.";

        savedFittingRepository.save(new SavedFitting(user, garment, bestSize.getSizeLabel(), fitScore));

        return new FitRecommendationResponse(garment.getId(), garment.getName(), bestSize.getSizeLabel(), fitScore, notes);
    }

    @Transactional(readOnly = true)
    public List<SavedFittingResponse> history(Long userId) {
        return savedFittingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(f -> new SavedFittingResponse(
                        f.getId(),
                        f.getGarment().getId(),
                        f.getGarment().getName(),
                        f.getRecommendedSize(),
                        f.getFitScore(),
                        f.getCreatedAt()))
                .toList();
    }

    private BodyMeasurement findLatestMeasurement(Long userId) {
        return bodyMeasurementRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "No measurements on file yet. Submit your measurements first."));
    }

    private BodyMeasurementResponse toResponse(BodyMeasurement measurement) {
        return new BodyMeasurementResponse(
                measurement.getId(),
                measurement.getHeightCm(),
                measurement.getWeightKg(),
                measurement.getChestCm(),
                measurement.getWaistCm(),
                measurement.getHipsCm(),
                measurement.getCreatedAt()
        );
    }

    private GarmentResponse toResponse(Garment garment) {
        List<GarmentSizeResponse> sizes = garment.getSizes().stream()
                .map(s -> new GarmentSizeResponse(
                        s.getSizeLabel(), s.getChestMinCm(), s.getChestMaxCm(),
                        s.getWaistMinCm(), s.getWaistMaxCm(), s.getHipsMinCm(), s.getHipsMaxCm()))
                .toList();
        return new GarmentResponse(garment.getId(), garment.getName(), garment.getBrand(), garment.getCategory(), sizes);
    }

    private double dimensionPenalty(double value, double min, double max) {
        if (value < min) {
            return min - value;
        }
        if (value > max) {
            return value - max;
        }
        return 0;
    }
}
