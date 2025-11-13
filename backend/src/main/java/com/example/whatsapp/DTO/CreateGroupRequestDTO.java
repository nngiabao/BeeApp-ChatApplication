package com.example.whatsapp.DTO;

import lombok.*;
import java.util.List;

@Data
@Builder
public class CreateGroupRequestDTO {
    private String groupName;
    private Long createdBy;
    private String imgUrl;
    private List<Long> memberIds; // all members (including creator)
}
