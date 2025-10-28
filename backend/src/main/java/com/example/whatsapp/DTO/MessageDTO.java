package com.example.whatsapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Integer id;
    private String type;         // text, image, video...
    private LocalDateTime createdAt;
    private String title;        // message title or body
    private Integer createdBy;   // user_id foreign key
}
