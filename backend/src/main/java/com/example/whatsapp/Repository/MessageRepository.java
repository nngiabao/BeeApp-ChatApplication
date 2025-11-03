package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.chatId = :chatId ORDER BY m.sentAt DESC")
    List<Message> findMessagesByChatId(Long chatId);

    @Query("SELECT m FROM Message m WHERE m.chatId = :chatId ORDER BY m.sentAt DESC LIMIT 1")
    Optional<Message> findLastMessage(Long chatId);
}
