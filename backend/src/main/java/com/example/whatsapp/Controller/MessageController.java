package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /*
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.sendMessage(message));
    }*/

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<Map<String, Object>> getMessagesByChat(@PathVariable Long chatId) {
        List<MessageDTO> messages = messageService.getMessagesByChatId(chatId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Messages fetched successfully");
        response.put("data", messages);
        return ResponseEntity.ok(response);
    }
}
