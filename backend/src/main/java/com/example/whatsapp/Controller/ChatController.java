package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.DTO.CreateGroupRequestDTO;
import com.example.whatsapp.DTO.GroupMemberDTO;
import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Chat;
import com.example.whatsapp.Entity.GroupMember;
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

        //Save to DB
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

        //Convert back to DTO for broadcasting
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

        //Send to all subscribers of this chat room
        messagingTemplate.convertAndSend(
                "/topic/chat/" + savedMessage.getChatId(),
                broadcast
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatDTO>> getAllChats(@PathVariable Long userId) {
        List<ChatDTO> chats = chatService.getAllChatsForUser(userId);
        return ResponseEntity.ok(chats);
    }
    //create new group
    @PostMapping("/group")
    public ResponseEntity<ChatDTO> createGroup(@RequestBody CreateGroupRequestDTO request) {
        return ResponseEntity.ok(chatService.createGroupChat(request));
    }

}
