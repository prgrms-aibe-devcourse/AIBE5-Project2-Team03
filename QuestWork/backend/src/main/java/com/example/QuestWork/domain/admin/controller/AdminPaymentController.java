package com.example.QuestWork.domain.admin.controller;

import com.example.QuestWork.domain.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Tag(name = "Admin Payment Test", description = "관리자 정산 테스트 API")
class AdminPaymentController {

    private final PaymentService paymentService;

    @PostMapping("/simulate")
    @Operation(summary = "정산 프로세스 시뮬레이션", description = "원금을 입력하면 수수료 10%를 제외하고 정산을 진행합니다.")
    public ResponseEntity<String> simulate(
            @RequestParam Long userId,
            @RequestParam Long questId,
            @RequestParam BigDecimal amount) {

        paymentService.processPaymentTest(userId, questId, amount);
        return ResponseEntity.ok("정산 처리가 완료되었습니다.");
    }
}