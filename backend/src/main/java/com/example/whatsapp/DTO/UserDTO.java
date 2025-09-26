package com.example.whatsapp.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDTO {
    @NotBlank
    private String phoneNumber;

    private String name;
}