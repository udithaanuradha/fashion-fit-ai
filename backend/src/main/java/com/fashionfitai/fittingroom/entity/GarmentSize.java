package com.fashionfitai.fittingroom.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "garment_sizes")
public class GarmentSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garment_id", nullable = false)
    private Garment garment;

    @Column(name = "size_label", nullable = false)
    private String sizeLabel;

    @Column(name = "chest_min_cm", nullable = false)
    private double chestMinCm;

    @Column(name = "chest_max_cm", nullable = false)
    private double chestMaxCm;

    @Column(name = "waist_min_cm", nullable = false)
    private double waistMinCm;

    @Column(name = "waist_max_cm", nullable = false)
    private double waistMaxCm;

    @Column(name = "hips_min_cm", nullable = false)
    private double hipsMinCm;

    @Column(name = "hips_max_cm", nullable = false)
    private double hipsMaxCm;

    public GarmentSize() {
    }

    public GarmentSize(Garment garment, String sizeLabel,
                        double chestMinCm, double chestMaxCm,
                        double waistMinCm, double waistMaxCm,
                        double hipsMinCm, double hipsMaxCm) {
        this.garment = garment;
        this.sizeLabel = sizeLabel;
        this.chestMinCm = chestMinCm;
        this.chestMaxCm = chestMaxCm;
        this.waistMinCm = waistMinCm;
        this.waistMaxCm = waistMaxCm;
        this.hipsMinCm = hipsMinCm;
        this.hipsMaxCm = hipsMaxCm;
    }

    public Long getId() {
        return id;
    }

    public Garment getGarment() {
        return garment;
    }

    public String getSizeLabel() {
        return sizeLabel;
    }

    public double getChestMinCm() {
        return chestMinCm;
    }

    public double getChestMaxCm() {
        return chestMaxCm;
    }

    public double getWaistMinCm() {
        return waistMinCm;
    }

    public double getWaistMaxCm() {
        return waistMaxCm;
    }

    public double getHipsMinCm() {
        return hipsMinCm;
    }

    public double getHipsMaxCm() {
        return hipsMaxCm;
    }
}
