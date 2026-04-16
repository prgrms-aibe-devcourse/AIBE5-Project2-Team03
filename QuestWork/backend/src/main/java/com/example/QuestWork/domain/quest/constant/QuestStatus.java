package com.example.QuestWork.domain.quest.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor

public enum QuestStatus {
    OPEN("모집 중"), CLOSED("모집 완료"),
    IN_PROCESS("진행 중"), FINISHED("종료"),
    PICKED("참여 신청 완료"), CANCELED("취소됨");

    private final String decription;
}
