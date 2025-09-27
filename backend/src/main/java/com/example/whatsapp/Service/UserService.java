package com.example.whatsapp.Service;

import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // ✅ Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //create
    public User createUser(User user) {
        return userRepository.save(user);
    }

    //update
    public Optional<User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setPassword(updatedUser.getPassword());
            user.setStatusMessage(updatedUser.getStatusMessage());
            user.setName(updatedUser.getName());
            user.setLastSeen(LocalDateTime.now());
            return userRepository.save(user);
        });
    }

    //delete
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    //find by phone
    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    //find by id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
