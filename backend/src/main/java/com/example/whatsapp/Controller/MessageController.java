package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    //send messgae

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<List<Message>>> getChatMessages(@PathVariable Long chatId) {
        List<Message> messages = messageService.getChatMessages(chatId);
        return ResponseEntity.ok(new ApiResponse<>("Messages fetched", messages));
    }
}
