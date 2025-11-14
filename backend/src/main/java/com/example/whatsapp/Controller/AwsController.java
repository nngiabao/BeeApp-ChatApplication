package com.example.whatsapp.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.S3Exception;
import io.github.cdimascio.dotenv.Dotenv;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/aws")
@RequiredArgsConstructor
public class AwsController {

    private final S3Client s3Client;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "file") String type
    ) {
        Dotenv dotenv = Dotenv.configure().filename("aws.env").load();
        String bucketName = dotenv.get("AWS_S3_BUCKET");

        try {
            if (!type.equals("file") && !type.equals("group") && !type.equals("invidual")) {
                return ResponseEntity.badRequest().body("Invalid folder type");
            }

            String folder = type + "/";
            String key = folder + UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putReq, RequestBody.fromBytes(file.getBytes()));

            String url = "https://" + bucketName + ".s3.amazonaws.com/" + key;
            String decoded = URLDecoder.decode(url, StandardCharsets.UTF_8);
            return ResponseEntity.ok(decoded);

        } catch (S3Exception e) {
            return ResponseEntity.status(500).body("AWS Error: " + e.awsErrorDetails().errorMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
