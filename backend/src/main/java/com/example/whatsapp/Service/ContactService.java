package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.Contact;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    //get all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public List<Contact> getContactsByUserId(Long userId) {
        return contactRepository.findByUserId(userId);
    }

    //Create new contact
    public Contact createContact(Contact contact) {
        contact.setCreatedAt(LocalDateTime.now());
        if (contact.getAlias() == null) {
            contact.setAlias(""); // default empty alias
        }
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

    //Get contact by ID
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    //Find contact by user & contact ID pair (useful for checking if they already exist)

}
