package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.TicketResponseDTO;
import com.example.whatsapp.DTO.TicketSupportDTO;
import com.example.whatsapp.Entity.TicketSupport;
import com.example.whatsapp.Entity.TicketResponse;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.SupportResponseRepository;
import com.example.whatsapp.Repository.SupportTicketRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportResponseRepository supportResponseRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    // Load all tickets
    public List<TicketSupportDTO> getAllTickets() {
        return supportTicketRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Search by username or phone number
    public List<TicketSupportDTO> searchTicketsByUsernameOrPhone(String query) {
        List<User> matchedUsers = userRepository
                .findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCase(query, query);

        List<Long> userIds = matchedUsers.stream().map(User::getId).toList();

        List<TicketSupport> tickets = supportTicketRepository.findByUserIdIn(userIds);

        return tickets.stream().map(this::toDTO).toList();
    }

    // Load by userId
    public List<TicketSupportDTO> getTicketsByUserId(Long userId) {
        return supportTicketRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TicketSupportDTO toDTO(TicketSupport ticket) {
        return TicketSupportDTO.builder()
                .id(ticket.getId())
                .userId(ticket.getUserId())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public List<TicketResponseDTO> getResponsesByTicketId(Long ticketId) {
        return supportResponseRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(response -> TicketResponseDTO.builder()
                        .id(response.getId())
                        .ticketId(response.getTicketId())
                        .managerId(response.getManagerId())
                        .response(response.getResponse())
                        .senderType(response.getSenderType())
                        .createdAt(response.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public TicketResponseDTO replyToTicket(Long ticketId, Long managerId, String message) {

        TicketResponse response = TicketResponse.builder()
                .ticketId(ticketId)
                .managerId(managerId)
                .response(message)
                .senderType("ADMIN")
                .createdAt(LocalDateTime.now())
                .build();

        TicketResponse saved = supportResponseRepository.save(response);

        return TicketResponseDTO.builder()
                .id(saved.getId())
                .ticketId(saved.getTicketId())
                .managerId(saved.getManagerId())
                .response(saved.getResponse())
                .senderType(saved.getSenderType())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public TicketSupport markTicketResolved(Long ticketId) {
        TicketSupport ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus("RESOLVED");
        ticket.setUpdatedAt(LocalDateTime.now());
        return supportTicketRepository.save(ticket);
    }
}
