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
    private String name;            // user full name
    private String username;        // unique username
    private String profilePicture;  // avatar URL
}
