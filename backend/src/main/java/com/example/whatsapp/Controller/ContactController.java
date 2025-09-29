package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<Contact>> addContact(
            @PathVariable Long userId,
            @RequestBody ContactDTO dto) {
        Contact contact = contactService.addContact(userId, dto);
        return ResponseEntity.ok(new ApiResponse<>("Contact added", contact));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContacts(@PathVariable Long userId) {
        List<Contact> contacts = contactService.getContacts(userId);
        return ResponseEntity.ok(new ApiResponse<>("Contacts fetched", contacts));
    }
}
