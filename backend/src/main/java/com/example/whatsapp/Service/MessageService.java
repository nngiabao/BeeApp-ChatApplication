package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.MessageDTO;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getChatMessages(Long chatId) {
        return messageRepository.findByChatIdOrderBySentAtAsc(chatId);
    }
}
