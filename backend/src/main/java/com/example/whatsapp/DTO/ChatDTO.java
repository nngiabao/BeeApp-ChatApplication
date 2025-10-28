package com.example.whatsapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {
    private String sender;
    private String title;      // the actual message text
    private String type;       // "text" for now
    private LocalDateTime createdAt;
}
