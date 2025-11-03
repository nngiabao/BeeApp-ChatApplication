package com.example.whatsapp.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(GroupMemberId.class)
public class GroupMember {

    @Id
    @Column(name = "chat_id")
    private Long chatId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(length = 10)
    private String role; // "member" or "admin"
}
