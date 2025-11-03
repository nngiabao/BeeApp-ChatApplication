package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/sendMessage")   // Client sends message here: /app/sendMessage
    @SendTo("/topic/public")          // Server broadcasts to: /topic/public
    public MessageDTO sendMessage(MessageDTO messageDTO) {

        System.out.println("Broadcast from user " + messageDTO.getSenderId() + ": " + messageDTO.getContent());

        // 1️⃣ Save message to database
        Message message = Message.builder()
                .chatId(messageDTO.getChatId())
                .senderId(messageDTO.getSenderId())
                .content(messageDTO.getContent())
                .status("sent")
                .messageType(messageDTO.getMessageType())
                .mediaUrl(messageDTO.getMediaUrl())
                .build();

        Message savedMessage = messageService.sendMessage(message);

        // 2️⃣ Convert back to DTO for broadcasting
        return MessageDTO.builder()
                .id(savedMessage.getId())
                .chatId(savedMessage.getChatId())
                .senderId(savedMessage.getSenderId())
                .content(savedMessage.getContent())
                .messageType(savedMessage.getMessageType())
                .mediaUrl(savedMessage.getMediaUrl())
                .status(savedMessage.getStatus())
                .sentAt(savedMessage.getSentAt())
                .build();
    }
}
