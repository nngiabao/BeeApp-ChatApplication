package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findUserByUsername(String username);
    //Optional<User> findByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

}
