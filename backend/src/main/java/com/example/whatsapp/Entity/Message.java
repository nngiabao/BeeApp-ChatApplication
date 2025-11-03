package com.example.whatsapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Chat reference
    @Column(name = "chat_id", nullable = false)
    private Long chatId;

    // User who sent the message
    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    // Text content (nullable if message is media)
    @Column(length = 255)
    private String content;

    // Timestamp when message was sent
    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    // Message delivery status (sent, delivered, read)
    @Column(length = 255)
    private String status;

    // Type of message (text, image, video, file, audio, system)
    @Column(name = "message_type", length = 20)
    private String messageType;

    // Media file URL (used for image/video/audio)
    @Column(name = "media_url", length = 255)
    private String mediaUrl;

}
