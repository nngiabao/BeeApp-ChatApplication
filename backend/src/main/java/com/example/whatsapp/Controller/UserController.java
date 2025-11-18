package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")
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
                .password(userDTO.getPassword())   // must map here
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
        try {
            return userService.updateUser(id, userDTO)
                    .map(updatedUser -> ResponseEntity.ok(
                            new ApiResponse<>("User updated successfully", updatedUser)))
                    .orElse(ResponseEntity.status(404)
                            .body(new ApiResponse<>("User not found", null)));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Phone number already in use")) {
                return ResponseEntity.status(409)
                        .body(new ApiResponse<>("Phone number already in use", null));
            }
            return ResponseEntity.status(400)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    //update profile picture
    @PutMapping("/{userId}/profile-picture")
    public ResponseEntity<?> updateProfilePicture(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        String imgUrl = body.get("imgUrl");
        if (imgUrl == null || imgUrl.isBlank()) {
            return ResponseEntity.badRequest().body("Image URL is required");
        }

        userService.updateProfilePicture(userId, imgUrl);
        return ResponseEntity.ok("Profile picture updated successfully");
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

    //change password
    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long id,
            @RequestParam("oldpass") String oldpass,
            @RequestParam("newpass") String newpass) {

        ApiResponse<String> response = userService.changePassword(id, oldpass, newpass);

        if ("Old password is incorrect".equals(response.getMessage())) {
            return ResponseEntity.status(404).body(response);
        }

        return ResponseEntity.ok(response);
    }


    //find by phone number
    @GetMapping("/{phone}")
    public ResponseEntity<ApiResponse<User>> getUserByPhone(@PathVariable String phone) {
        return userService.getUserByPhoneNumber(phone)
                .map(user -> ResponseEntity.ok(new ApiResponse<>("User found", user)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }

    //login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User users) {
        String username = users.getUsername();
        Optional<User> userOptional = userService.getUserByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(users.getPassword())) {

            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect password"));
        }
        //no JWT
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", user); // assuming 'user' is your User entity or DTO
        //set online
        userService.setUserOnline(username,true);
        //
        return ResponseEntity.ok(response);

    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Username is required", null));
        }

        Optional<User> optionalUser = userService.getUserByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>("User not found", null));
        }

        userService.setUserOnline(username, false);
        return ResponseEntity.ok(new ApiResponse<>("Logout successful", username));
    }
}
