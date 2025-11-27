package com.example.whatsapp.Controller; //

import com.example.whatsapp.DTO.GroupMemberDTO;
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

    @DeleteMapping("/remove/{chatId}/{userId}")
    public ResponseEntity<String> removeMember(@PathVariable Long chatId, @PathVariable Long userId) {
        boolean removed = groupMemberService.removeMember(chatId, userId);
        return removed
                ? ResponseEntity.ok("Member removed successfully")
                : ResponseEntity.badRequest().body("Member not found");
    }
}
