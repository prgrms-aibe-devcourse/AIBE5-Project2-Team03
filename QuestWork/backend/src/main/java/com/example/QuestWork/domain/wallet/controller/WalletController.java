package com.example.QuestWork.domain.wallet.controller;

import com.example.QuestWork.domain.wallet.dto.SettlementRequest;
import com.example.QuestWork.domain.wallet.dto.WalletResponse;
import com.example.QuestWork.domain.wallet.service.WalletService;
import com.example.QuestWork.domain.withdraw.dto.WithdrawRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/settlement")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    /**
     * 1. 매니저가 지급 승인을 눌렀을 때 호출
     * 수수료 10%를 제외하고 프리랜서 지갑으로 입금합니다.
     */
    @PostMapping("/approve")
    public ResponseEntity<String> approveSettlement(@RequestBody SettlementRequest request) {
        // 💡 DTO에서 데이터를 꺼내 서비스로 전달합니다.
        walletService.processSettlement(
                request.getFreelancerId(),
                request.getQuestId(),
                BigDecimal.valueOf(request.getOriginalAmount())
        );
        return ResponseEntity.ok("정산 처리가 성공적으로 완료되었습니다.");
    }

    /**
     * 2. 사용자 지갑 잔액 조회
     * 특정 유저의 현재 잔액을 DB에서 조회하여 반환합니다.
     */
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<WalletResponse> getWallet(@PathVariable Long userId) {
        // 💡 서비스에서 실제 DB 잔액을 가져옵니다.
        BigDecimal balance = walletService.getBalance(userId);

        // 💡 조회 결과를 응답용 DTO에 담아서 반환합니다.
        return ResponseEntity.ok(new WalletResponse(userId, balance));
    }

    /**
     * 3. 출금 신청 처리
     * 유저가 마이페이지에서 출금을 신청할 때 호출합니다.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<String> requestWithdraw(@RequestBody WithdrawRequestDto request) {
        try {
            // 💡 서비스 호출: 잔액 차감 + 출금 요청 기록 생성
            walletService.requestWithdraw(
                    request.getUserId(),
                    request.getAmount(),
                    request.getBankName(),
                    request.getAccountNumber(),
                    request.getAccountHolder()
            );
            return ResponseEntity.ok("출금 신청이 성공적으로 접수되었습니다.");
        } catch (IllegalArgumentException e) {
            // 잔액 부족 등 비즈니스 로직 에러
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 기타 서버 에러
            return ResponseEntity.internalServerError().body("출금 처리 중 서버 오류가 발생했습니다.");
        }
    }
}