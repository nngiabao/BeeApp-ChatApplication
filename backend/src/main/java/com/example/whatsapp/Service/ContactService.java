package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.ContactRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    //get all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    //Get contact by ID
    public List<Contact> getContactsByUserId(Long id) {
        return contactRepository.findByUserId(id);
    }
    //Create new contact
    public Contact createContact(Long userId, String lookupValue,String alias) {
        //try to check username
        Optional<User> foundUser = userRepository.findUserByUsername(lookupValue);
        //then try to check phone number
        if (foundUser.isEmpty()) {
            foundUser = userRepository.findByPhoneNumber(lookupValue);
        }
        if (foundUser.isEmpty()) {
            throw new RuntimeException("No user found with that username or phone number");
        }

        Long contactId = foundUser.get().getId();

        if (userId.equals(contactId)) {
            throw new RuntimeException("You cannot add yourself as a contact.");
        }
        if (contactRepository.existsByUserIdAndContactId(userId, contactId)) {
            throw new RuntimeException("This contact already exists.");
        }

        Contact contact = Contact.builder()
                .userId(userId)
                .contactId(contactId)
                .alias(alias)
                .createdAt(LocalDateTime.now())
                .isBlocked(false)
                .build();

        return contactRepository.save(contact);
    }

    //update
    public Optional<Contact> updateContact(Long id, ContactDTO contactDTO) {
        return contactRepository.findById(id).map(contact -> {
            contact.setUserId(contactDTO.getUserId());
            contact.setContactId(contactDTO.getContactId());
            contact.setAlias(contactDTO.getAlias());
            //save back to db
            return contactRepository.save(contact);
        });
    }

    //Delete contact
    public boolean deleteContact(Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return true;
        }
        return false;
    }

    //Block contact
    public boolean blockContact(Long id) {
        //find contact exist or not ?
        Contact contact = contactRepository.findById(id).orElse(null);
        //
        if (contact != null) {
            contact.setBlocked(true);
            contactRepository.save(contact);
            return true;
        }
        return false;
    }



    //Find contact by user & contact ID pair (useful for checking if they already exist)

}
