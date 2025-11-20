package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
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
    // update user details
    public Optional<User> updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id).map(user -> {

            // ✅ Check for duplicate phone numbers
            String newPhone = userDTO.getPhoneNumber();
            if (newPhone != null && !newPhone.equals(user.getPhoneNumber())) {
                boolean exists = userRepository.existsByPhoneNumber(newPhone);
                if (exists) {
                    throw new RuntimeException("Phone number already in use");
                }
                user.setPhoneNumber(newPhone);
            }

            // update other fields
            user.setUsername(userDTO.getUsername());
            user.setName(userDTO.getName());
            user.setStatusMessage(userDTO.getStatusMessage());

            if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
                user.setPassword(userDTO.getPassword());
            }

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
    //change password
    public ApiResponse<String> changePassword(Long id, String oldpass, String newpass) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(oldpass)) {
            return new ApiResponse<>("Old password is incorrect", null);
        }

        if (newpass == null || newpass.isBlank()) {
            return new ApiResponse<>("New password cannot be empty", null);
        }

        user.setPassword(newpass);
        userRepository.save(user);

        return new ApiResponse<>("Password updated successfully", null);
    }
    //update profile picture
    public void updateProfilePicture(Long userId, String imgUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePicture(imgUrl);
        userRepository.save(user);
    }


    //find by phone
    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }
    //find by id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    //find by username => login
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
    //set status or offline
    public void setUserOnline(String username,boolean status) {
        userRepository.findUserByUsername(username).ifPresent(user -> {
            user.setIsOnline(status);
            userRepository.save(user);
        });
    }

    public Long countTotalUsers() {
        return userRepository.count();
    }
}
