package com.example.QuestWork.domain.quest.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor

public enum QuestStatus {
    OPEN("모집 중"), CLOSED("모집 완료"),
    IN_PROCESS("진행 중"), FINISHED("종료"),
    PICKED("참여 신청 완료"), CANCELED("취소됨"),
    COMPLETED("정산 완료"); // 💡 돈 지급까지 완료된 최종 상태 (추가)

    private final String description;
}
