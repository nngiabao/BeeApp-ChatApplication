package com.example.whatsapp.Controller; //

import com.example.whatsapp.DTO.GroupMemberDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Payload.ApiResponse;
import com.example.whatsapp.Service.GroupMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberService groupMemberService;

    // GET all group members of one chat
    @GetMapping("/{chatId}/members")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(
            @PathVariable Long chatId
    ) {
        List<GroupMemberDTO> members = groupMemberService.getGroupMembers(chatId);
        return ResponseEntity.ok(
                new ApiResponse<>("Group members loaded successfully", members)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupMember>> getGroupsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(groupMemberService.getGroupsByUser(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<GroupMember> addMember(@RequestBody GroupMemberDTO dto) {
        return ResponseEntity.ok(groupMemberService.addMember(dto));
    }
    //remove member
    @DeleteMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<ApiResponse<String>> removeMember(
            @PathVariable Long chatId,
            @PathVariable Long userId
    ) {
        boolean removed = groupMemberService.removeMember(chatId, userId);

        if (!removed) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to remove member", null));
        }

        return ResponseEntity.ok(
                new ApiResponse<>("Member removed successfully", null)
        );
    }

    //update group profile picture
    @PostMapping("/{chatId}/picture")
    public ResponseEntity<?> updateGroupPicture(
            @PathVariable Long chatId,
            @RequestParam String imgUrl
    ) {
        boolean updated = groupMemberService.updateGroupPicture(chatId, imgUrl);

        if (updated) {
            return ResponseEntity.ok("Group picture updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update group picture.");
        }
    }

    //update group name
    @PostMapping("/{chatId}/rename")
    public ResponseEntity<?> renameGroup(
            @PathVariable Long chatId,
            @RequestParam String name
    ) {
        boolean updated = groupMemberService.renameGroup(chatId, name);

        if (updated) {
            return ResponseEntity.ok("Group name updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to rename group.");
        }
    }
    //Get eligible contacts (not in the group)
    @GetMapping("/{chatId}/eligible-contacts/{adminId}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getEligibleContacts(
            @PathVariable Long chatId,
            @PathVariable Long adminId
    ) {
        List<UserDTO> users = groupMemberService.getEligibleContacts(chatId, adminId);
        return ResponseEntity.ok(new ApiResponse<>("Eligible contacts loaded", users));
    }

    //Add new member
    @PostMapping("/{chatId}/add/{userId}")
    public ResponseEntity<ApiResponse<String>> addMember(
            @PathVariable Long chatId,
            @PathVariable Long userId
    ) {
        groupMemberService.addMember(chatId, userId);
        return ResponseEntity.ok(new ApiResponse<>("Member added successfully", null));
    }
}
