package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderBySentAtAsc(Long chatId);
    List<Message> findBySenderIdAndChatId(Long senderId, Long chatId);
}
