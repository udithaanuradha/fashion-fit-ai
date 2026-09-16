package com.fashionfitai;

import com.fashionfitai.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class FashionFitAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(FashionFitAiApplication.class, args);
    }
}
