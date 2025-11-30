package com.example.whatsapp.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Bean
    public S3Client s3Client() {
        Dotenv dotenv = Dotenv.configure().filename("aws.env").load();

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                dotenv.get("AWS_ACCESS_KEY"),
                dotenv.get("AWS_SECRET_KEY")
        );

        return S3Client.builder()
                .region(Region.of(dotenv.get("AWS_REGION"))) //us-east-2
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}
