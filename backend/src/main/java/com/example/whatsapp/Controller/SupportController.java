package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.TicketResponseDTO;
import com.example.whatsapp.DTO.TicketSupportDTO;
import com.example.whatsapp.Entity.TicketSupport;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supports")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;
    //private final

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketSupportDTO>>> getAllTickets() {
        List<TicketSupportDTO> tickets = supportService.getAllTickets();
        return ResponseEntity.ok(new ApiResponse<>("Fetched all tickets", tickets));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TicketSupportDTO>>> searchTickets(@RequestParam String query) {
        List<TicketSupportDTO> results = supportService.searchTicketsByUsernameOrPhone(query);
        return ResponseEntity.ok(new ApiResponse<>("Search results", results));
    }

    //get ticket by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TicketSupportDTO>>> getTicketsByUserId(@PathVariable Long userId) {
        List<TicketSupportDTO> tickets = supportService.getTicketsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>("Fetched tickets for user " + userId, tickets));
    }
    //get response by that ticket
    @GetMapping("/{ticketId}/responses")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getResponses(@PathVariable Long ticketId) {
        List<TicketResponseDTO> responses = supportService.getResponsesByTicketId(ticketId);
        return ResponseEntity.ok(new ApiResponse<>("Loaded responses", responses));
    }
    //
    @PostMapping("/{ticketId}/reply")
    public TicketResponseDTO replyToTicket(
            @PathVariable Long ticketId,
            @RequestParam Long managerId,
            @RequestParam String message
    ) {
        return supportService.replyToTicket(ticketId, managerId, message);
    }
    //
    @PutMapping("/{ticketId}/resolve")
    public TicketSupport resolveTicket(@PathVariable Long ticketId) {
        return supportService.markTicketResolved(ticketId);
    }
}
