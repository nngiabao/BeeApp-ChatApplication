package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.TicketSupportDTO;
import com.example.whatsapp.Entity.TicketSupport;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.SupportTicketRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService {

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
        List<User> matchedUsers = userRepository.findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(query, query);

        List<Long> userIds = matchedUsers.stream()
                .map(User::getId)
                .collect(Collectors.toList());

        List<TicketSupport> tickets = supportTicketRepository.findByUserIdIn(userIds);

        return tickets.stream().map(this::toDTO).collect(Collectors.toList());
    }

    //Load by userId
    public List<TicketSupportDTO> getTicketsByUserId(Long userId) {
        List<TicketSupport> tickets = supportTicketRepository.findByUserId(userId);
        return tickets.stream()
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
}
