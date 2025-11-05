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

    /**
     * ✅ Save a message to the database.
     * Sets sentAt and default status before saving.
     */
    public Message sendMessage(Message message) {
        message.setSentAt(LocalDateTime.now());
        if (message.getStatus() == null) {
            message.setStatus("sent");
        }
        return messageRepository.save(message);
    }

    /**
     * ✅ Get all messages for a specific chat, sorted by time.
     */
    public List<MessageDTO> getMessagesByChatId(Long chatId) {
        return messageRepository.findMessagesByChatId(chatId)
                .stream()
                .map(msg -> MessageDTO.builder()
                        .id(msg.getId())
                        .chatId(msg.getChatId())
                        .senderId(msg.getSenderId())
                        .content(msg.getContent())
                        .status(msg.getStatus())
                        .messageType(msg.getMessageType())
                        .mediaUrl(msg.getMediaUrl())
                        .sentAt(msg.getSentAt())
                        .build())
                .toList();
    }

    /**
     * ✅ Update the message status (delivered, seen, etc.)
     */
    public void updateMessageStatus(Long messageId, String newStatus) {
        messageRepository.findById(messageId).ifPresent(msg -> {
            msg.setStatus(newStatus);
            messageRepository.save(msg);
        });
    }

    /**
     * ✅ Get the latest message in a chat (useful for chat list preview).
     */
    public MessageDTO getLastMessageByChatId(Long chatId) {
        return messageRepository.findLastMessage(chatId)
                .map(msg -> MessageDTO.builder()
                        .id(msg.getId())
                        .chatId(msg.getChatId())
                        .senderId(msg.getSenderId())
                        .content(msg.getContent())
                        .status(msg.getStatus())
                        .messageType(msg.getMessageType())
                        .mediaUrl(msg.getMediaUrl())
                        .sentAt(msg.getSentAt())
                        .build())
                .orElse(null);
    }
}
