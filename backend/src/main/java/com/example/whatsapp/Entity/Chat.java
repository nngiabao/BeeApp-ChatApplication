package com.example.whatsapp.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Represents a single row in the 'post' database table.
 * Uses standard JPA annotations for mapping and Lombok for boilerplate code.
 */
@Entity
@Table(name = "chats") // Replace 'post' with your actual table name if different
@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Assumes auto-incrementing PK
    @Column(name = "id")
    private Long id;

    @Column(name = "type", length = 10, nullable = false)
    private String type;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;
}