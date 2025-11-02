package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;


@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(new ApiResponse<>("Contacts fetched successfully", contacts));
    }

    //find by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getUserById(@PathVariable Long id) {
        return contactService.getContactById(id)
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

        Contact savedContact = contactService.createContact(contact);
        return ResponseEntity.ok(new ApiResponse<>("Contact created successfully", savedContact));
    }

    //update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> updateContact(
            @PathVariable Long id,
            @RequestBody ContactDTO contactDTO) {

        return contactService.updateContact(id, contactDTO)
                .map(updatedContact -> ResponseEntity.ok(
                        new ApiResponse<>("Contact updated successfully", updatedContact)))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse<>("Contact not found", null)));
    }

    //block contact
    @PutMapping("/block/{id}")
    public ResponseEntity<ApiResponse<Contact>> blockContact(@PathVariable Long id) {
        if (contactService.blockContact(id))
            return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (contactService.deleteContact(id))
            return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }


}
