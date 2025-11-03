package com.example.whatsapp.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String content;
    private String status;
    private String messageType;
    private String mediaUrl;
    private LocalDateTime sentAt;
}
