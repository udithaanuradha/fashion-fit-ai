package com.fashionfitai.fittingroom.entity;

import com.fashionfitai.auth.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "body_measurements")
public class BodyMeasurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "height_cm", nullable = false)
    private double heightCm;

    @Column(name = "weight_kg", nullable = false)
    private double weightKg;

    @Column(name = "chest_cm", nullable = false)
    private double chestCm;

    @Column(name = "waist_cm", nullable = false)
    private double waistCm;

    @Column(name = "hips_cm", nullable = false)
    private double hipsCm;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public BodyMeasurement() {
    }

    public BodyMeasurement(User user, double heightCm, double weightKg, double chestCm, double waistCm, double hipsCm) {
        this.user = user;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.chestCm = chestCm;
        this.waistCm = waistCm;
        this.hipsCm = hipsCm;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public double getHeightCm() {
        return heightCm;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public double getChestCm() {
        return chestCm;
    }

    public double getWaistCm() {
        return waistCm;
    }

    public double getHipsCm() {
        return hipsCm;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
