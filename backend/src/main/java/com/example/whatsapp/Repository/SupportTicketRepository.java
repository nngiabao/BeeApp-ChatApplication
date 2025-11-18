package com.example.whatsapp.Repository;


import com.example.whatsapp.Entity.TicketSupport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface SupportTicketRepository extends JpaRepository<TicketSupport, Long> {
    public List<TicketSupport> findByUserId(Long id);
    //
    List<TicketSupport> findTop5ByOrderByCreatedAtDesc();
    //
    Long countByStatus(String status);
    //
    List<TicketSupport> findByUserIdIn(List<Long> userIds);
}
