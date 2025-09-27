package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    //private final UserService userService;
    //=> inject
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("Users fetched successfully", users));
    }
    //create
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())   // 👈 must map here
                .name(userDTO.getName())
                .statusMessage(userDTO.getStatusMessage())
                .profilePicture(userDTO.getProfilePicture())
                .isOnline(userDTO.getIsOnline())
                .accountType(userDTO.getAccountType())
                .build();

        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(new ApiResponse<>("User created successfully", savedUser));
    }
    //update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO) {

        return userService.updateUser(id, userDTO)
                .map(updatedUser -> ResponseEntity.ok(
                        new ApiResponse<>("User updated successfully", updatedUser)))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse<>("User not found", null)));
    }



    //delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok(new ApiResponse<>("User deleted successfully", "Deleted ID: " + id));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>("User not found", null));
    }

    //find by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(new ApiResponse<>("User found", user)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }


    //find by phone number
    @GetMapping("/{phone}")
    public ResponseEntity<ApiResponse<User>> getUserByPhone(@PathVariable String phone) {
        return userService.getUserByPhoneNumber(phone)
                .map(user -> ResponseEntity.ok(new ApiResponse<>("User found", user)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }

}
