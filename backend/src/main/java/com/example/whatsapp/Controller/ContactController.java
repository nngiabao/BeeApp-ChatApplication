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
    //we dont need to use this one
    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(new ApiResponse<>("Contacts fetched successfully", contacts));
    }
    //load the contact by id
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContactsById(@PathVariable Long userId) {
        List<Contact> contacts = contactService.getContactsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>("Contacts fetched successfully", contacts));
    }


    @PostMapping("/add")
    public ResponseEntity<?> addContactByLookup(@RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String lookupValue = request.get("lookupValue");
        String alias = request.get("name");
        try {
            //
            Contact contact = contactService.createContact(userId, lookupValue, alias);
            return ResponseEntity.ok(contact);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>("Contact not found", null));
        }
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
