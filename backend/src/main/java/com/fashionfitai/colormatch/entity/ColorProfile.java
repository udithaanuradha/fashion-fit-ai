package com.fashionfitai.colormatch.entity;

import com.fashionfitai.auth.entity.User;
import com.fashionfitai.colormatch.model.Season;
import com.fashionfitai.colormatch.model.Undertone;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "color_profiles")
public class ColorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "skin_tone_hex", nullable = false)
    private String skinToneHex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Undertone undertone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Season season;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ColorProfile() {
    }

    public ColorProfile(User user, String skinToneHex, Undertone undertone, Season season) {
        this.user = user;
        this.skinToneHex = skinToneHex;
        this.undertone = undertone;
        this.season = season;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getSkinToneHex() {
        return skinToneHex;
    }

    public Undertone getUndertone() {
        return undertone;
    }

    public Season getSeason() {
        return season;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
