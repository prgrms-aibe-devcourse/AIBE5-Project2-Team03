package com.example.QuestWork.domain.wallet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 지갑 상태를 응답할 때 사용하는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor // 💡 모든 필드를 인자로 받는 생성자 생성
public class WalletResponse {
    private Long userId;        // 사용자 ID

    // 💡 Long에서 BigDecimal로 변경
    private BigDecimal balance;  // 현재 잔액

    // 💡 명시적 생성자 (필요한 경우)
    public static WalletResponse of(Long userId, BigDecimal balance) {
        return new WalletResponse(userId, balance);
    }
}