package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Find all chats created by a specific user
    @Query("SELECT c FROM Chat c WHERE c.createdBy = :userId")
    List<Chat> findAllByCreatedBy(@Param("userId") Long userId);

}


