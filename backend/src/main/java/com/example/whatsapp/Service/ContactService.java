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
    public List<ContactDTO> getContactsByUserId(Long id) {
        return contactRepository.findContactsWithUserDetails(id);
    }
    //Create new contact
    public Contact createContact(Long userId, String lookupValue, String alias) {
        // 1️⃣ Try to find user by username first
        Optional<User> foundUser = userRepository.findUserByUsername(lookupValue);

        // 2️⃣ Then try by phone number
        if (foundUser.isEmpty()) {
            foundUser = userRepository.findByPhoneNumber(lookupValue);
        }

        // 3️⃣ Validate user existence
        User targetUser = foundUser.orElseThrow(
                () -> new RuntimeException("No user found with that username or phone number")
        );

        Long contactId = targetUser.getId();

        // ❌ Prevent self-adding
        if (userId.equals(contactId)) {
            throw new RuntimeException("You cannot add yourself as a contact.");
        }

        // ❌ Prevent duplicate contact (A → B)
        if (contactRepository.existsByUserIdAndContactId(userId, contactId)) {
            throw new RuntimeException("This contact already exists.");
        }

        // ✅ Use alias if available, else fallback to user's name
        String finalAlias = (alias == null || alias.trim().isEmpty())
                ? targetUser.getName()
                : alias.trim();

        // ✅ Save A → B
        Contact contact = Contact.builder()
                .userId(userId)
                .contactId(contactId)
                .alias(finalAlias)
                .createdAt(LocalDateTime.now())
                .isBlocked(false)
                .build();

        contactRepository.save(contact);

        // ✅ Also save B → A (reverse), but only if it doesn’t already exist
        if (!contactRepository.existsByUserIdAndContactId(contactId, userId)) {
            // Fetch current user to get name for reverse alias
            User currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));

            Contact reverse = Contact.builder()
                    .userId(contactId)
                    .contactId(userId)
                    .alias(currentUser.getName())
                    .createdAt(LocalDateTime.now())
                    .isBlocked(false)
                    .build();

            contactRepository.save(reverse);
        }
        return contact;
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
    public void deleteMutualContact(Long userId, Long contactId) {
        contactRepository.findByUserIdAndContactId(userId, contactId)
                .ifPresent(contactRepository::delete);

        contactRepository.findByUserIdAndContactId(contactId, userId)
                .ifPresent(contactRepository::delete);
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
    //unblock contact
    public boolean unblockContact(Long id) {
        //find contact exist or not ?
        Contact contact = contactRepository.findById(id).orElse(null);
        //
        if (contact != null) {
            contact.setBlocked(false);
            contactRepository.save(contact);
            return true;
        }
        return false;
    }

    //Find contact by user & contact ID pair (useful for checking if they already exist)

}
