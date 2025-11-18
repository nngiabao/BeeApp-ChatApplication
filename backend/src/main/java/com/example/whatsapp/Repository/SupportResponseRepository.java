package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface SupportResponseRepository extends JpaRepository<TicketResponse, Long> {
    List<TicketResponse> findTop5ByOrderByCreatedAtDesc();
    //
    List<TicketResponse> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
