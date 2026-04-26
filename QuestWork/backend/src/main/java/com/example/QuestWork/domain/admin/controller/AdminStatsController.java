package com.example.QuestWork.domain.admin.controller;

import com.example.QuestWork.domain.admin.dto.AdminStatsResponse;
import com.example.QuestWork.domain.admin.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/summary")
    public ResponseEntity<AdminStatsResponse> getSummary() {
        // 서비스의 getAdminStats()가 위에서 만든 바구니를 리턴해줌!
        AdminStatsResponse stats = adminStatsService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
}