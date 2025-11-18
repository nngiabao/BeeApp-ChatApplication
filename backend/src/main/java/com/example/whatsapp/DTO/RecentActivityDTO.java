package com.example.whatsapp.DTO;

import lombok.*;
import java.time.*;
//
import java.util.Date;

@Data
@Builder
public class RecentActivityDTO {
    private String type;      // "USER", "TICKET", "REPLY"
    private String message;   // e.g. "User John registered"
    private LocalDateTime timestamp;
}