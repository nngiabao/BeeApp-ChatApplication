package com.example.whatsapp.DTO;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponseDTO {
    private Long id;
    private Long ticketId;
    private Long managerId;
    private String response;
    private LocalDateTime createdAt;
}
