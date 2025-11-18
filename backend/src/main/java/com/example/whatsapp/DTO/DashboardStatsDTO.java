package com.example.whatsapp.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long totalChats;
    private long totalReports;
    private long blockedUsers;
    private long openTickets;
}