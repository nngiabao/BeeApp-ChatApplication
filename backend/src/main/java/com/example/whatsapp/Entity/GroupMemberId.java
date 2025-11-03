package com.example.whatsapp.Entity;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberId implements Serializable {
    private Long chatId;
    private Long userId;
}
