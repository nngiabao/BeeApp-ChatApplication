package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.Entity.Chat;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Repository.ChatRepository;
import com.example.whatsapp.Repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public List<ChatDTO> getAllChatsForUser(Long userId) {
        List<Chat> chats = chatRepository.findAllChatsForUser(userId);

        return chats.stream().map(chat -> {
            Message lastMessage = messageRepository.findLastMessage(chat.getId()).orElse(null);

            return ChatDTO.builder()
                    .id(chat.getId())
                    .type(chat.getType())
                    .title(chat.getTitle())
                    .createdBy(chat.getCreatedBy())
                    .createdAt(LocalDateTime.now())
                    .lastMessage(lastMessage != null ? lastMessage.getContent() : "")
                    .lastMessageTime(lastMessage.getSentAt())
                    .build();
        }).collect(Collectors.toList());
    }
}
