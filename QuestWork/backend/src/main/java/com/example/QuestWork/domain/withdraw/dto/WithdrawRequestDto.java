package com.example.QuestWork.domain.withdraw.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Getter
@NoArgsConstructor
public class WithdrawRequestDto {
    private Long userId;
    private BigDecimal amount;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}