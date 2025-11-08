package com.example.whatsapp.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CreateGroupRequestDTO {
    private String groupName;
    private Long createdBy;
    private List<Long> memberIds; // all members (including creator)
}
