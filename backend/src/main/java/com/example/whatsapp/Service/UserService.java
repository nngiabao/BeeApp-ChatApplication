package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Exception.UserNotFoundException;
import com.example.whatsapp.Respository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User getUserByPhone(String phone) {
        return userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new UserNotFoundException("No user with phone: " + phone));
    }
}
