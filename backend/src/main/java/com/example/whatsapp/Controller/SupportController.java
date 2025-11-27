package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.TicketResponseDTO;
import com.example.whatsapp.DTO.TicketSupportDTO;
import com.example.whatsapp.Entity.TicketSupport;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

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
            @RequestParam Long senderId,
            @RequestParam String senderType,
            @RequestParam String message
    ) {
        return supportService.replyToTicket(ticketId, senderType,senderId, message);
    }
    //
    @PutMapping("/{ticketId}/resolve")
    public TicketSupport resolveTicket(@PathVariable Long ticketId) {
        return supportService.markTicketResolved(ticketId);
    }
    //create ticket
    @PostMapping
    public ResponseEntity<ApiResponse<TicketSupport>> createTicket(@RequestBody Map<String, String> payload) {
        try {
            Long userId = Long.parseLong(payload.get("userId"));
            String subject = payload.get("subject");
            String message = payload.get("message");

            if (subject == null || subject.isBlank() || message == null || message.isBlank()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Subject and message cannot be empty", null));
            }

            TicketSupport ticket = supportService.createTicket(userId, subject, message);
            return ResponseEntity.ok(new ApiResponse<>("Ticket submitted successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid input", null));
        }
    }
}
