package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    //all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //create
    public User createUser(User user) {
        user.setLastSeen(LocalDateTime.now());
        return userRepository.save(user);
    }

    //update
    public Optional<User> updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDTO.getUsername());
            user.setPhoneNumber(userDTO.getPhoneNumber());
            user.setPassword(userDTO.getPassword());
            user.setName(userDTO.getName());
            user.setStatusMessage(userDTO.getStatusMessage());
            user.setProfilePicture(userDTO.getProfilePicture());
            user.setIsOnline(userDTO.getIsOnline());
            user.setAccountType(userDTO.getAccountType());
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
