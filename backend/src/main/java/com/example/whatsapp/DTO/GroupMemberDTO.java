package com.example.whatsapp.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMemberDTO {
    private Long chatId;
    private Long userId;
    private String role;
}
