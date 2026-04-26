package com.example.QuestWork.domain.withdraw.constant;

public enum WithdrawStatus {
    REQUESTED("출금 신청"),
    APPROVED("승인 완료"),
    COMPLETED("지급 완료"),
    REJECTED("반려됨");

    private final String description;

    WithdrawStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

