package com.example.whatsapp.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatDTO {
    private Long id;
    private String type;
    private String title;
    private Long createdBy;
    private LocalDateTime createdAt;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}
