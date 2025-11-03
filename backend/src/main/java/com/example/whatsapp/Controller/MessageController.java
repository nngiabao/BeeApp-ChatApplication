package com.example.whatsapp.Controller;

import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.sendMessage(message));
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(messageService.getMessagesByChat(chatId));
    }
}
