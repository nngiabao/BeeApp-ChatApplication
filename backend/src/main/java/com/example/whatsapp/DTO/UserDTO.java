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

    @NotBlank
    private String password;

    private String name;
    private String statusMessage;
}
