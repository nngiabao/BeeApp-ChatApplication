package com.example.whatsapp.Repository;

import com.example.whatsapp.DTO.ContactDTO;
import com.example.whatsapp.Entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByUserId(Long userId);
    List<Contact> findByContactId(Long contactId);
    boolean existsByUserIdAndContactId(Long userId, Long contactId);
    @Query("""
    SELECT new com.example.whatsapp.DTO.ContactDTO(
        c.id,
        c.userId,
        c.contactId,
        COALESCE(c.alias, u.name),
        u.statusMessage,
        u.profilePicture,
        c.isBlocked
    )
    FROM Contact c
    JOIN User u ON c.contactId = u.id
    WHERE c.userId = :userId
""")
    List<ContactDTO> findContactsWithUserDetails(@Param("userId") Long userId);
    //count blocked contacts
    long countByIsBlockedTrue();
}
