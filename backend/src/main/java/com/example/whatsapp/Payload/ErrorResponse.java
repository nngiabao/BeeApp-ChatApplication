package com.example.whatsapp.Payload;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private String error;
    private String details;
    private int status;
    private LocalDateTime timestamp;
}
