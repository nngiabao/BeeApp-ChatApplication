package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    //private final UserService userService;
    /*
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("Users fetched successfully", users));
    }*/
}
