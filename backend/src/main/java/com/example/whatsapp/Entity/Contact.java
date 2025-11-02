package com.example.whatsapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "contact_id", nullable = false)
    private Long contactId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 255)
    private String alias;

    @Column(name = "is_blocked", nullable = false)
    private boolean isBlocked;

}
