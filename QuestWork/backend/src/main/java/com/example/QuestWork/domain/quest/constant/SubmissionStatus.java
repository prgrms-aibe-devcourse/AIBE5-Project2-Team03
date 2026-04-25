package com.example.QuestWork.domain.quest.constant;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor

public enum SubmissionStatus {
    SUBMITTED("제출 됨"),
    UPDATED("업데이트 됨"),
    WINNER("우승자 선정됨");

    private final String description;
}
