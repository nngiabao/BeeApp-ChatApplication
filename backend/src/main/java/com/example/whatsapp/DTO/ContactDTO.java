package com.example.whatsapp.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private Long id;
    private Long userId;
    private Long contactId;
    private String alias;             // alias or actual user name
    private String statusMessage;    // from users table
    private String profilePicture;   // from users table
    private boolean isBlocked;
}

