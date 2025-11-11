package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    //Get all messages of a chat (oldest first) — used in Chat Window
    List<Message> findByChatIdOrderBySentAtAsc(Long chatId);

    //Alias for clarity — used in ChatService preload
    default List<Message> findMessagesByChatId(Long chatId) {
        return findByChatIdOrderBySentAtAsc(chatId);
    }

    //Get latest message (for sidebar preview)
    Optional<Message> findTopByChatIdOrderBySentAtDesc(Long chatId);
}
