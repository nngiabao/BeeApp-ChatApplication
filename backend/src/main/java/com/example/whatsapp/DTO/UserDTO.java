package com.example.whatsapp.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    @NotBlank
    private String username;

    @NotBlank
    private String phoneNumber;

    private String password;

    private String name;
    private String statusMessage;
    private String profilePicture;  // URL or file path
    private Boolean isOnline;       // true / false
    private String accountType;     // e.g., "standard", "business"
}
