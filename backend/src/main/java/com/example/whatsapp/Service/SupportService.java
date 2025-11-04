package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.TicketResponseDTO;
import com.example.whatsapp.DTO.TicketSupportDTO;
import com.example.whatsapp.Entity.TicketSupport;
import com.example.whatsapp.Entity.TicketResponse;
import com.example.whatsapp.Repository.SupportTicketRepository;
import com.example.whatsapp.Repository.SupportResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportResponseRepository supportResponseRepository;
    private final SupportTicketRepository supportTicketRepository;

    //Get all tickets
    public List<TicketSupport> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    //Get tickets by user
    public List<TicketSupport> getTicketsByUserId(Long userId) {
        return supportTicketRepository.findByUserId(userId);
    }

    //Create new support ticket
    public TicketSupport createTicket(TicketSupport ticketSupport) {
        ticketSupport.setCreatedAt(LocalDateTime.now());
        ticketSupport.setUpdatedAt(LocalDateTime.now());
        if (ticketSupport.getStatus() == null) {
            ticketSupport.setStatus("open");
        }
        return supportTicketRepository.save(ticketSupport);
    }

    /*/Update ticket
    public Optional<Message> updateTicket(Long id, MessageDTO dto) {
        return supportRepository.findTicketById(id).map(ticket -> {
            ticket.setSubject(dto.getSubject());
            ticket.setMessage(dto.getMessage());
            ticket.setStatus(dto.getStatus());
            ticket.setUpdatedAt(LocalDateTime.now());
            return supportRepository.saveTicket(ticket);
        });
    }


    //Get single ticket with responses
    public Optional<Message> getTicketById(Long id) {
        return supportRepository.findTicketById(id);
    }

    //reponse ticket

    //Add response and update ticket.updatedAt
    public TicketResponse createResponse(TicketResponse response) {
        response.setCreatedAt(LocalDateTime.now());
        TicketResponse savedResponse = supportRepository.saveResponse(response);

        // Update ticket.updatedAt
        Message ticket = response.getTicket();
        if (ticket != null) {
            ticket.setUpdatedAt(LocalDateTime.now());
            supportRepository.saveTicket(ticket);
        }

        return savedResponse;
    }

    //Get all responses by ticket ID
    public List<TicketResponse> getResponsesByTicketId(Long ticketId) {
        return supportRepository.findResponsesByTicketId(ticketId);
    }*/


}
