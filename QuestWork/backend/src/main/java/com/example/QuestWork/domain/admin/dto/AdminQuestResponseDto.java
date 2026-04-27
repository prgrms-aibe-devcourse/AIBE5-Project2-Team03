package com.example.QuestWork.domain.admin.dto;

import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminQuestResponseDto {

    private Long questId;
    private String title;
    private QuestStatus status;
    private BigDecimal rewardAmount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deadline;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 매니저 정보
    private Long managerProfileId;
    private Long managerUserId;
    private String managerName;
    private String companyName;

    public static AdminQuestResponseDto from(Quest quest) {
        var manager = quest.getManagerId();
        return AdminQuestResponseDto.builder()
                .questId(quest.getId())
                .title(quest.getTitle())
                .status(quest.getStatus())
                .rewardAmount(quest.getRewardAmount())
                .deadline(quest.getDeadline())
                .createdAt(quest.getCreatedAt())
                .managerProfileId(manager.getId())
                .managerUserId(manager.getUser().getId())
                .managerName(manager.getManagerName())
                .companyName(manager.getCompanyName())
                .build();
    }
}
