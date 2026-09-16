package com.fashionfitai.fittingroom.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "garments")
public class Garment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GarmentCategory category;

    // Eager: a garment's size chart is small and always needed alongside the garment itself,
    // which also avoids lazy-loading it outside of a transaction when mapping to a response DTO.
    @OneToMany(mappedBy = "garment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<GarmentSize> sizes = new ArrayList<>();

    public Garment() {
    }

    public Garment(String name, String brand, GarmentCategory category) {
        this.name = name;
        this.brand = brand;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public GarmentCategory getCategory() {
        return category;
    }

    public List<GarmentSize> getSizes() {
        return sizes;
    }
}
