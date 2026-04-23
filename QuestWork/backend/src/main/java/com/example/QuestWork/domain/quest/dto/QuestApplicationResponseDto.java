package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.constant.ApplicationStatus;
import com.example.QuestWork.domain.quest.entity.QuestApplication;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder

public class QuestApplicationResponseDto {
    private Long applicationId;
    private Long questId;
    private Long memberId;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public static QuestApplicationResponseDto from(QuestApplication questApplication) {
        return QuestApplicationResponseDto.builder()
                .applicationId(questApplication.getId())
                .questId(questApplication.getQuest().getId())
                .memberId(questApplication.getMember().getId())
                .status(questApplication.getStatus())
                .appliedAt(questApplication.getAppliedAt())
                .build();
    }
}
