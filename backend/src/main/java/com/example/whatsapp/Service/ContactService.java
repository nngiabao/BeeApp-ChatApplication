package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.ContactRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public Contact addContact(Long userId, ContactDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User contactUser = userRepository.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        Contact contact = Contact.builder()
                .user(user)
                .contact(contactUser)
                .alias(dto.getAlias())
                .build();

        return contactRepository.save(contact);
    }

    public List<Contact> getContacts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return contactRepository.findByUser(user);
    }
}
