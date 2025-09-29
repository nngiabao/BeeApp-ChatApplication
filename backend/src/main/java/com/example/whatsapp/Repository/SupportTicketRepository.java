package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<Ticket, Long> {
}
