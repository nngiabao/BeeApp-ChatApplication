package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.DashboardStatsDTO;
import com.example.whatsapp.DTO.RecentActivityDTO;
import com.example.whatsapp.Service.AdminService;
import com.example.whatsapp.Service.ChatService;
import com.example.whatsapp.Service.MessageService;
import com.example.whatsapp.Service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    //inject
    final AdminService adminService;
    final UserService userService;
    final MessageService messageService;
    final ChatService chatService;

    @GetMapping("/recent-activity")
    public List<RecentActivityDTO> getRecentActivity() {
        return adminService.getRecentActivity();
    }
    //
    @GetMapping("/dashboard/stats")
    public DashboardStatsDTO getStats() {
        return adminService.getDashboardStats();
    }
    //get overview
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {

        long totalUsers = userService.countTotalUsers();
        long totalChats = chatService.countTotalChats();
        long sharedFiles = messageService.countSharedFiles();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalChats", totalChats);
        stats.put("sharedFiles", sharedFiles);

        return ResponseEntity.ok(stats);
    }
}
