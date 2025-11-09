package com.example.whatsapp.Repository;

import com.example.whatsapp.Entity.GroupMember;
import com.example.whatsapp.Entity.GroupMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
    List<GroupMember> findByChatId(Long chatId);
    List<GroupMember> findByUserId(Long userId);
    boolean existsByChatIdAndUserId(Long chatId, Long userId);
}
