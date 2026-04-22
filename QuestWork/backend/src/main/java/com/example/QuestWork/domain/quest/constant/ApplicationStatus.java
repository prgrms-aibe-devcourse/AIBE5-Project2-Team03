package com.example.QuestWork.domain.quest.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApplicationStatus {
    APPLIED("신청"),
    ACCEPTED("수락"),
    REJECTED("거절"),
    CANCELED("취소");

    private final String description;
}
