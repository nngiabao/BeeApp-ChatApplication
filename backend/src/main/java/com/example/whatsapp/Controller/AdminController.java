package com.example.whatsapp.Controller;

import com.example.whatsapp.DTO.DashboardStatsDTO;
import com.example.whatsapp.DTO.RecentActivityDTO;
import com.example.whatsapp.Service.AdminService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    //inject
    final AdminService adminService;

    @GetMapping("/recent-activity")
    public List<RecentActivityDTO> getRecentActivity() {
        return adminService.getRecentActivity();
    }
    //
    @GetMapping("/dashboard/stats")
    public DashboardStatsDTO getStats() {
        return adminService.getDashboardStats();
    }
}
