package com.example.whatsapp.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contacts", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "contact_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // owner

    @ManyToOne
    @JoinColumn(name = "contact_id", nullable = false)
    private User contact;  // the contact user

    private String alias;
    private Boolean isBlocked = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
