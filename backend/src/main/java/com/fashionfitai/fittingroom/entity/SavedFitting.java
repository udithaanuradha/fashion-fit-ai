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
@Table(name = "saved_fittings")
public class SavedFitting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garment_id", nullable = false)
    private Garment garment;

    @Column(name = "recommended_size", nullable = false)
    private String recommendedSize;

    @Column(name = "fit_score", nullable = false)
    private int fitScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SavedFitting() {
    }

    public SavedFitting(User user, Garment garment, String recommendedSize, int fitScore) {
        this.user = user;
        this.garment = garment;
        this.recommendedSize = recommendedSize;
        this.fitScore = fitScore;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Garment getGarment() {
        return garment;
    }

    public String getRecommendedSize() {
        return recommendedSize;
    }

    public int getFitScore() {
        return fitScore;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
