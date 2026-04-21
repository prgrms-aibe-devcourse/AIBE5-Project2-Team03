package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class QuestUpdateRequestDto {
    private String title;
    private JsonNode formData;
    private BigDecimal rewardAmount;
    private LocalDateTime deadline;
    private QuestStatus status;

}
