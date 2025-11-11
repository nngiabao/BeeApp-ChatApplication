package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.DTO.CreateGroupRequestDTO;
import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Service.ChatService;
import com.example.whatsapp.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    //WebSocket message sending
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        System.out.println("💬 Received message from user " + messageDTO.getSenderId() +
                " in chat " + messageDTO.getChatId() + ": " + messageDTO.getContent());

        // ✅ Save to DB
        Message message = Message.builder()
                .chatId(messageDTO.getChatId())
                .senderId(messageDTO.getSenderId())
                .content(messageDTO.getContent())
                .status("SENT")
                .messageType(
                        messageDTO.getMessageType() != null ? messageDTO.getMessageType() : "text"
                )
                .mediaUrl(messageDTO.getMediaUrl())
                .build();

        Message savedMessage = messageService.sendMessage(message);

        // ✅ Broadcast the *saved* message
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

        messagingTemplate.convertAndSend(
                "/topic/chat/" + savedMessage.getChatId(),
                broadcast
        );
    }


    //Get all chats for sidebar
    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatDTO>> getAllChats(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getAllChatsForUser(userId));
    }

    //Create new group
    @PostMapping("/group")
    public ResponseEntity<ChatDTO> createGroup(@RequestBody CreateGroupRequestDTO request) {
        return ResponseEntity.ok(chatService.createGroupChat(request));
    }
    //create new chat
    @PostMapping("/create")
    public ResponseEntity<ChatDTO> createChat(@RequestBody ChatDTO chatRequest) {
        ChatDTO newChat = chatService.createIndividualChat(chatRequest);
        return ResponseEntity.ok(newChat);
    }

    //create new private chat

}
