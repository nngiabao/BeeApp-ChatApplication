package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Service.ChatService;
import com.example.whatsapp.Service.MessageService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    /**
     * When a message is sent by client:
     *  - Client sends to: /app/chat.sendMessage
     *  - Server broadcasts to: /topic/chat/{chatId}
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        System.out.println("💬 Received message from user " + messageDTO.getSenderId() +
                " in chat " + messageDTO.getChatId() + ": " + messageDTO.getContent());

        // 1️⃣ Save to DB
        Message message = Message.builder()
                .chatId(messageDTO.getChatId())
                .senderId(messageDTO.getSenderId())
                .content(messageDTO.getContent())
                .status("sent")
                .messageType(
                        messageDTO.getMessageType() != null ? messageDTO.getMessageType() : "text"
                )
                .mediaUrl(messageDTO.getMediaUrl())
                .build();

        Message savedMessage = messageService.sendMessage(message);

        // 2️⃣ Convert back to DTO for broadcasting
        MessageDTO broadcast = MessageDTO.builder()
                .id(savedMessage.getId())
                .chatId(savedMessage.getChatId())
                .senderId(savedMessage.getSenderId())
                .content(savedMessage.getContent())
                .messageType(savedMessage.getMessageType())
                .mediaUrl(savedMessage.getMediaUrl())
                .status(savedMessage.getStatus())
                .sentAt(savedMessage.getSentAt())
                .build();

        // 3️⃣ Send to all subscribers of this chat room
        messagingTemplate.convertAndSend(
                "/topic/chat/" + savedMessage.getChatId(),
                broadcast
        );
    }

    @GetMapping
    public ResponseEntity<List<ChatDTO>> getAllChats(@RequestParam Long userId) {
        List<ChatDTO> chatList = chatService.getAllChatsForUser(userId);
        return ResponseEntity.ok(chatList);
    }
}
