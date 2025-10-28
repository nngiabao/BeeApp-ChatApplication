package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ChatDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/sendMessage")   // client sends to /app/sendMessage
    @SendTo("/topic/public")          // server broadcasts to /topic/public
    public ChatDTO sendMessage(ChatDTO message) {
        System.out.println("Broadcast message from " + message.getSender() + ": " + message.getTitle());
        return message;
    }
}
