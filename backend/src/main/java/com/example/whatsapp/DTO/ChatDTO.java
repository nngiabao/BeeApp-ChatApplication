package com.example.whatsapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {
    private Long id;
    private String name;
    private boolean isGroup;
    private Long createdBy;
    private LocalDateTime createdAt;
    private List<MessageDTO> messages;
}
