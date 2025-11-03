package com.example.whatsapp.Service;

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
        message.setSentAt(LocalDateTime.now());
        if (message.getStatus() == null) message.setStatus("sent");
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByChat(Long chatId) {
        return messageRepository.findMessagesByChatId(chatId);
    }
}
