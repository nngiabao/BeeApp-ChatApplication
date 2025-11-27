package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.GroupMemberDTO;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.User;
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
        if (groupMemberRepository.existsByChatIdAndUserId(chatId, userId)) {
            groupMemberRepository.deleteById(new com.example.whatsapp.Entity.GroupMemberId(chatId, userId));
            return true;
        }
        return false;
    }
}
