package com.example.whatsapp.Controller;

import com.example.whatsapp.Entity.Ticket;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {
    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> submitTicket(@RequestBody Ticket ticket) {
        Ticket saved = supportService.submitTicket(ticket);
        return ResponseEntity.ok(new ApiResponse<>("Support ticket submitted", saved));
    }
}
