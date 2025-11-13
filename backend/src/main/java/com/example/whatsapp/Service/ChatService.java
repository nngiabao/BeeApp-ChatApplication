package com.example.whatsapp.Service;

import com.example.whatsapp.DTO.ChatDTO;
import com.example.whatsapp.DTO.CreateGroupRequestDTO;
import com.example.whatsapp.Entity.Chat;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.Message;
import com.example.whatsapp.Repository.ChatRepository;
import com.example.whatsapp.Repository.GroupMemberRepository;
import com.example.whatsapp.Repository.MessageRepository;
import com.example.whatsapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    // ✅ Sidebar chat list (lightweight)
    public List<ChatDTO> getAllChatsForUser(Long userId) {
        List<Chat> chats = chatRepository.findAllChatsInvolvingUser(userId);

        return chats.stream().map(chat -> {
            // 🧩 Get latest message for preview
            Message lastMsg = messageRepository
                    .findTopByChatIdOrderBySentAtDesc(chat.getId())
                    .orElse(null);

            ChatDTO.ChatDTOBuilder builder = ChatDTO.builder()
                    .id(chat.getId())
                    .type(chat.getType())
                    .title(chat.getTitle())
                    .createdBy(chat.getCreatedBy())
                    .createdAt(chat.getCreatedAt())
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : null)
                    .lastMessageTime(lastMsg != null ? lastMsg.getSentAt() : null);

            // 🧩 Add contact info for PRIVATE chats
            if ("PRIVATE".equalsIgnoreCase(chat.getType())) {
                List<GroupMember> members = groupMemberRepository.findByChatId(chat.getId());
                Long otherUserId = members.stream()
                        .map(GroupMember::getUserId)
                        .filter(id -> !id.equals(userId))
                        .findFirst()
                        .orElse(null);

                if (otherUserId != null) {
                    userRepository.findById(otherUserId).ifPresent(other -> {
                        builder.contactId(other.getId());
                        builder.title(other.getName() != null ? other.getName() : other.getUsername());
                        builder.imgUrl(other.getProfilePicture());
                    });
                }
            }

            return builder.build();
        }).collect(Collectors.toList());
    }



    //Create a new group
    public ChatDTO createGroupChat(CreateGroupRequestDTO req) {
        Chat chat = Chat.builder()
                .title(req.getGroupName())
                .type("GROUP")
                .createdBy(req.getCreatedBy())
                .createdAt(LocalDateTime.now())
                .chatImageUrl(req.getImgUrl())
                .build();

        Chat savedChat = chatRepository.save(chat);

        List<GroupMember> members = req.getMemberIds().stream()
                .map(userId -> GroupMember.builder()
                        .chatId(savedChat.getId())
                        .userId(userId)
                        .role(userId.equals(req.getCreatedBy()) ? "ADMIN" : "MEMBER")
                        .build())
                .toList();

        groupMemberRepository.saveAll(members);

        return ChatDTO.builder()
                .id(savedChat.getId())
                .title(savedChat.getTitle())
                .type(savedChat.getType())
                .build();
    }

    //create chat private
    public ChatDTO createIndividualChat(ChatDTO chatRequest) {
        Chat chat = Chat.builder()
                .title(chatRequest.getTitle())
                .type("PRIVATE")
                .createdBy(chatRequest.getCreatedBy())
                .createdAt(LocalDateTime.now())
                .build();

        Chat saved = chatRepository.save(chat);
        //add group memeber
        Long id = saved.getId();

        groupMemberRepository.save(GroupMember.builder()
                .chatId(id)
                .userId(chatRequest.getCreatedBy())
                .role("MEMBER")
                .build());

        groupMemberRepository.save(GroupMember.builder()
                .chatId(id)
                .userId(chatRequest.getContactId())
                .role("MEMBER")
                .build());

        return ChatDTO.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .type(saved.getType())
                .createdBy(saved.getCreatedBy())
                .build();
    }

}
