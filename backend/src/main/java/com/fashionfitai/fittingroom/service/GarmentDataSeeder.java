package com.fashionfitai.fittingroom.service;

import com.fashionfitai.fittingroom.entity.Garment;
import com.fashionfitai.fittingroom.entity.GarmentCategory;
import com.fashionfitai.fittingroom.entity.GarmentSize;
import com.fashionfitai.fittingroom.repository.GarmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GarmentDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(GarmentDataSeeder.class);

    private final GarmentRepository garmentRepository;

    public GarmentDataSeeder(GarmentRepository garmentRepository) {
        this.garmentRepository = garmentRepository;
    }

    @Override
    public void run(String... args) {
        if (garmentRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial high-fashion garments catalog...");

        Garment blazer = new Garment("Milanese Wool Blazer", "Atelier V", GarmentCategory.OUTERWEAR);
        blazer.addSize(new GarmentSize(blazer, "S", 86, 92, 70, 76, 90, 96));
        blazer.addSize(new GarmentSize(blazer, "M", 93, 99, 77, 83, 97, 103));
        blazer.addSize(new GarmentSize(blazer, "L", 100, 106, 84, 90, 104, 110));
        blazer.addSize(new GarmentSize(blazer, "XL", 107, 114, 91, 98, 111, 118));

        Garment blouse = new Garment("Silk Charmeuse Blouse", "Maison Claire", GarmentCategory.TOP);
        blouse.addSize(new GarmentSize(blouse, "S", 84, 89, 66, 71, 89, 94));
        blouse.addSize(new GarmentSize(blouse, "M", 90, 95, 72, 77, 95, 100));
        blouse.addSize(new GarmentSize(blouse, "L", 96, 102, 78, 84, 101, 107));
        blouse.addSize(new GarmentSize(blouse, "XL", 103, 110, 85, 92, 108, 115));

        Garment trousers = new Garment("High-Rise Tailored Trousers", "Sartoriale", GarmentCategory.BOTTOM);
        trousers.addSize(new GarmentSize(trousers, "S", 80, 95, 65, 70, 90, 95));
        trousers.addSize(new GarmentSize(trousers, "M", 80, 100, 71, 76, 96, 101));
        trousers.addSize(new GarmentSize(trousers, "L", 85, 105, 77, 83, 102, 108));
        trousers.addSize(new GarmentSize(trousers, "XL", 90, 112, 84, 91, 109, 116));

        Garment dress = new Garment("Bias-Cut Velvet Midi Dress", "Aura Noir", GarmentCategory.DRESS);
        dress.addSize(new GarmentSize(dress, "S", 84, 90, 66, 72, 90, 96));
        dress.addSize(new GarmentSize(dress, "M", 91, 97, 73, 79, 97, 103));
        dress.addSize(new GarmentSize(dress, "L", 98, 105, 80, 87, 104, 111));
        dress.addSize(new GarmentSize(dress, "XL", 106, 114, 88, 96, 112, 120));

        Garment sweater = new Garment("Cashmere Knit Crewneck", "Nordic Loom", GarmentCategory.TOP);
        sweater.addSize(new GarmentSize(sweater, "S", 86, 92, 68, 74, 88, 94));
        sweater.addSize(new GarmentSize(sweater, "M", 93, 100, 75, 82, 95, 102));
        sweater.addSize(new GarmentSize(sweater, "L", 101, 108, 83, 90, 103, 110));
        sweater.addSize(new GarmentSize(sweater, "XL", 109, 118, 91, 100, 111, 120));

        garmentRepository.saveAll(List.of(blazer, blouse, trousers, dress, sweater));
        log.info("Successfully seeded 5 designer garments with size charts.");
    }
}
