package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    //Get all messages of a chat, oldest first (for ChatWindow)
    List<Message> findByChatIdOrderBySentAtAsc(Long chatId);

    //Get the most recent message (for Chat preview)
    Optional<Message> findTopByChatIdOrderBySentAtDesc(Long chatId);
}
