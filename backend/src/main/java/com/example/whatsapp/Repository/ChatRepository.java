package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("""
        SELECT c FROM Chat c
        WHERE c.type = 'private' 
        AND c.id IN (
            SELECT gm.chatId FROM GroupMember gm WHERE gm.userId = :userId
        )
        OR c.type = 'group' 
        AND c.id IN (
            SELECT gm.chatId FROM GroupMember gm WHERE gm.userId = :userId
        )
        ORDER BY c.createdAt DESC
    """)
    List<Chat> findAllChatsForUser(Long userId);
}
