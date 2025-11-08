package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.DTO.CreateGroupRequestDTO;
import com.example.whatsapp.Entity.Chat;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Repository.ChatRepository;
import com.example.whatsapp.Repository.GroupMemberRepository;
import com.example.whatsapp.Repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final GroupMemberRepository groupMemberRepository;

    public List<ChatDTO> getAllChatsForUser(Long userId) {
        List<Chat> chats = chatRepository.findAllByCreatedBy(userId);

        return chats.stream().map(chat -> {
            // Find last message
            Message lastMsg = messageRepository
                    .findTopByChatIdOrderBySentAtDesc(chat.getId())
                    .orElse(null);

            return ChatDTO.builder()
                    .id(chat.getId())
                    .title(chat.getTitle())
                    .type(chat.getType())
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : null)
                    .lastMessageTime(lastMsg != null ? lastMsg.getSentAt() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    //Add mew group chat
    public ChatDTO createGroupChat(CreateGroupRequestDTO req) {
        //Create group chat
        Chat chat = Chat.builder()
                .title(req.getGroupName())
                .type("GROUP")
                .createdBy(req.getCreatedBy())
                .createdAt(LocalDateTime.now())
                .build();

        Chat savedChat = chatRepository.save(chat);

        //Add all members
        List<GroupMember> members = req.getMemberIds().stream()
                .map(userId -> GroupMember.builder()
                        .chatId(savedChat.getId())
                        .userId(userId)
                        .role(userId.equals(req.getCreatedBy()) ? "ADMIN" : "MEMBER")
                        .build())
                .toList();

        groupMemberRepository.saveAll(members);

        //Return minimal DTO
        return ChatDTO.builder()
                .id(savedChat.getId())
                .title(savedChat.getTitle())
                .type(savedChat.getType())
                .build();
    }
}
