package com.example.whatsapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private Long id;
    private Long userId;
    private Long contactId;
    private String alias;
    private boolean isBlocked;
    private LocalDateTime createdAt;
}
