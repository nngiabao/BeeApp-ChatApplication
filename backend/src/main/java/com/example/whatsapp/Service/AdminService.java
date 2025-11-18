package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.DashboardStatsDTO;
import com.example.whatsapp.DTO.RecentActivityDTO;
import com.example.whatsapp.Entity.TicketResponse;
import com.example.whatsapp.Repository.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@AllArgsConstructor
public class AdminService {
    //inject repo
    private final UserRepository userRepository;
    private final SupportTicketRepository ticketRepository;
    private final SupportResponseRepository responseRepository;
    private final ContactRepository contactRepository;
    private final ChatRepository chatRepository;
    //
    public List<RecentActivityDTO> getRecentActivity() {
        List<RecentActivityDTO> activity = new ArrayList<>();



        // Latest 5 tickets
        ticketRepository.findTop5ByOrderByCreatedAtDesc()
                .forEach(t -> activity.add(RecentActivityDTO.builder()
                        .type("TICKET")
                        .message("Ticket #" + t.getId() + " created")
                        .timestamp(t.getCreatedAt())
                        .build()));

        // Latest 5 replies
        responseRepository.findTop5ByOrderByCreatedAtDesc()
                .forEach(r -> activity.add(RecentActivityDTO.builder()
                        .type("REPLY")
                        .message("Admin replied to Ticket #" + r.getTicketId())
                        .timestamp(r.getCreatedAt())
                        .build()));

        // Sort all by timestamp descending
        return activity.stream()
                .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp).reversed())
                .limit(10)
                .toList();
    }
    //load stats
    public DashboardStatsDTO getDashboardStats() {
        return DashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByIsOnlineTrue())
                .blockedUsers(contactRepository.countByIsBlockedTrue())
                .totalChats(chatRepository.count())
                .totalReports(ticketRepository.count())
                .openTickets(ticketRepository.countByStatus("OPEN"))
                .build();
    }

}
