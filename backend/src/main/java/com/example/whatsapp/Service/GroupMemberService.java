package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.GroupMemberDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.Chat;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.User;
import com.example.whatsapp.Repository.ChatRepository;
import com.example.whatsapp.Repository.GroupMemberRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    //Get all members in a chat
    public List<GroupMemberDTO> getGroupMembers(Long chatId) {
        return groupMemberRepository.findMembersByChatId(chatId);
    }
    //
    // Get all members in a chat
    public List<GroupMember> getMembersByChat(Long chatId) {
        return groupMemberRepository.findByChatId(chatId);
    }

    // Get all groups a user is part of
    public List<GroupMember> getGroupsByUser(Long userId) {
        return groupMemberRepository.findByUserId(userId);
    }

    // Add new member
    public GroupMember addMember(GroupMemberDTO dto) {
        if (groupMemberRepository.existsByChatIdAndUserId(dto.getChatId(), dto.getUserId())) {
            throw new RuntimeException("User already in this chat.");
        }

        GroupMember member = GroupMember.builder()
                .chatId(dto.getChatId())
                .userId(dto.getUserId())
                .role(dto.getRole() != null ? dto.getRole() : "member")
                .build();

        return groupMemberRepository.save(member);
    }
    //fix role => revoke or set manager
    public boolean removeMember(Long chatId, Long userId,String role) {
        //GroupMember  member = groupMemberRepository.findByUserId(userId);
        if (groupMemberRepository.existsByChatIdAndUserId(chatId, userId)) {

            return true;
        }
        return false;
    }
    // Remove member
    public boolean removeMember(Long chatId, Long userId) {
        Optional<GroupMember> gm = groupMemberRepository.findByChatIdAndUserId(chatId, userId);

        if (gm.isEmpty()) {
            return false;
        }

        groupMemberRepository.delete(gm.get());
        return true;
    }


    //update group profile picture
    public boolean updateGroupPicture(Long chatId, String imgUrl) {
        try {
            Chat chat = chatRepository.findById(chatId)
                    .orElseThrow(() -> new RuntimeException("Chat not found"));

            chat.setChatImageUrl(imgUrl);
            chatRepository.save(chat);

            return true;
        } catch (Exception e) {
            System.out.println("Error updating group picture: " + e.getMessage());
            return false;
        }
    }

    //update group name
    public boolean renameGroup(Long chatId, String name) {
        try {
            Chat chat = chatRepository.findById(chatId)
                    .orElseThrow(() -> new RuntimeException("Chat not found"));

            // optional validation
            if (name.length() < 1 || name.length() > 30) {
                throw new RuntimeException("Name must be 1–30 characters.");
            }

            chat.setTitle(name);
            chatRepository.save(chat);

            return true;
        } catch (Exception e) {
            System.out.println("❌ Error renaming group: " + e.getMessage());
            return false;
        }
    }
    //
    public void addMember(Long chatId, Long userId) {

        // Check if already exists
        boolean exists = groupMemberRepository.existsByChatIdAndUserId(chatId, userId);
        if (exists) {
            throw new RuntimeException("User already in group");
        }

        GroupMember gm = GroupMember.builder()
                .chatId(chatId)
                .userId(userId)
                .role("MEMBER")
                .build();

        groupMemberRepository.save(gm);
    }
    //
    public List<UserDTO> getEligibleContacts(Long chatId, Long adminId) {

        List<User> users = groupMemberRepository.findContactsNotInGroup(adminId, chatId);

        return users.stream()
                .map(u -> UserDTO.builder()
                        .username(u.getUsername())
                        .phoneNumber(u.getPhoneNumber())
                        .name(u.getName())
                        .profilePicture(u.getProfilePicture())
                        .build())
                .toList();
    }

}
