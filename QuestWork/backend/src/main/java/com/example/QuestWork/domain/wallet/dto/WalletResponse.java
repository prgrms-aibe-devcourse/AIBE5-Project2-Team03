package com.example.QuestWork.domain.wallet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 지갑 상태를 응답할 때 사용하는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponse {
    private Long userId;   // 사용자 ID
    private Long balance;  // 현재 잔액
}