package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportResponseRepository extends JpaRepository<TicketResponse, Long> {
}
