package com.example.whatsapp.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "status_message")
    private String statusMessage;

    private String name;

    @Column(name = "profile_picture")
    private String profilePicture; // URL or file path

    @Column(name = "is_online")
    private Boolean isOnline;

    @Column(name = "account_type")
    private String accountType; // e.g., "standard", "business"
}