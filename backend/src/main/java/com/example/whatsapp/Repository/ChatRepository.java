package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    //Chats created by this user (your original query)
    @Query("SELECT c FROM Chat c WHERE c.createdBy = :userId")
    List<Chat> findAllByCreatedBy(@Param("userId") Long userId);

    //NEW: All chats where this user is a member (even if not the creator)
    @Query("""
           SELECT DISTINCT c 
           FROM Chat c 
           JOIN GroupMember gm ON c.id = gm.chatId 
           WHERE gm.userId = :userId
           """)
    List<Chat> findAllByUserId(@Param("userId") Long userId);
    //this one for slidebar
    @Query("""
        SELECT DISTINCT c FROM Chat c
        LEFT JOIN GroupMember gm ON gm.chatId = c.id
        WHERE c.createdBy = :userId OR gm.userId = :userId
        """)
    List<Chat> findAllChatsInvolvingUser(@Param("userId") Long userId);
}
