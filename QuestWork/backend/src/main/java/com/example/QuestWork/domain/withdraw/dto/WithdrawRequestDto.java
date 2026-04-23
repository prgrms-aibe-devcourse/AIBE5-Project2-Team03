package com.example.QuestWork.domain.withdraw.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class WithdrawRequestDto {
    private Long userId;
    private Long amount;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}