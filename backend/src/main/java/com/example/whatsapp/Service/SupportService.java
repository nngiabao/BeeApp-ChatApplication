package com.example.whatsapp.Service;

import com.example.whatsapp.Entity.Ticket;
import com.example.whatsapp.Repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupportService {
    private final SupportTicketRepository repository;

    public Ticket submitTicket(Ticket ticket) {
        return repository.save(ticket);
    }
}
