package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;


@RestController
@RequestMapping("/supports")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;
    /*
    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = supportService.getAllContacts();
        return ResponseEntity.ok(new ApiResponse<>("Contacts fetched successfully", contacts));
    }

    //find by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getUserById(@PathVariable Long id) {
        return supportService.getContactById(id)
                .map(contact -> ResponseEntity.ok(new ApiResponse<>("Contact found", contact)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>("Contact not found", null)));
    }

    //create
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> createContact(@Valid @RequestBody ContactDTO contactDTO) {
        Contact contact = Contact.builder()
                .userId(contactDTO.getUserId())
                .contactId(contactDTO.getContactId())
                .alias(contactDTO.getAlias())
                .isBlocked(false)
                .createdAt(LocalDateTime.now())
                .build();

        Contact savedContact = supportService.createContact(contact);
        return ResponseEntity.ok(new ApiResponse<>("Contact created successfully", savedContact));
    }

    //update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> updateContact(
            @PathVariable Long id,
            @RequestBody ContactDTO contactDTO) {

        return supportService.updateContact(id, contactDTO)
                .map(updatedContact -> ResponseEntity.ok(
                        new ApiResponse<>("Contact updated successfully", updatedContact)))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse<>("Contact not found", null)));
    }

    //block contact
    @PutMapping("/block/{id}")
    public ResponseEntity<ApiResponse<Contact>> blockContact(@PathVariable Long id) {
        if (supportService.blockContact(id))
            return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (supportService.deleteContact(id))
            return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

*/
}
