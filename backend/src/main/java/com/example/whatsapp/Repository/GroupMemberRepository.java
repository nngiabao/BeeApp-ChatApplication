package com.example.whatsapp.Repository;

import com.example.whatsapp.DTO.GroupMemberDTO;
import com.example.whatsapp.DTO.UserDTO;
import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.GroupMemberId;
import com.example.whatsapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
    List<GroupMember> findByChatId(Long chatId);
    List<GroupMember> findByUserId(Long userId);
    boolean existsByChatIdAndUserId(Long chatId, Long userId);
    @Query("""
        SELECT new com.example.whatsapp.DTO.GroupMemberDTO(
            gm.chatId,
            gm.userId,
            gm.role,
            u.name,
            u.username,
            u.profilePicture
        )
        FROM GroupMember gm
        JOIN User u ON u.id = gm.userId
        WHERE gm.chatId = :chatId
    """)
    List<GroupMemberDTO> findMembersByChatId(Long chatId);
}
