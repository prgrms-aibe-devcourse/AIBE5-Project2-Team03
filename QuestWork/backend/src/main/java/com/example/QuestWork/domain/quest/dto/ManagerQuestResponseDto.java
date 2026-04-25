package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.entity.Quest;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder

public class ManagerQuestResponseDto {
    private Long questId;
    private String title;
    private BigDecimal rewardAmount;
    private String status;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    public static ManagerQuestResponseDto from(Quest quest) {
        return ManagerQuestResponseDto.builder()
                .questId(quest.getId())
                .title(quest.getTitle())
                .rewardAmount(quest.getRewardAmount())
                .status(quest.getStatus().name())
                .deadline(quest.getDeadline())
                .createdAt(quest.getCreatedAt())
                .build();
    }
}
