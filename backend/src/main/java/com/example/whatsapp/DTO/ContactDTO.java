package com.example.whatsapp.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private Long contactId;  // user to add
    private String alias;
}
