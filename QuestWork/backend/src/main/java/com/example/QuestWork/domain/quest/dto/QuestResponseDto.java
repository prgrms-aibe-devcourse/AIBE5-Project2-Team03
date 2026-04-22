package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder

public class QuestResponseDto {

    private Long id;
    private Long managerId;
    private String title;
    private JsonNode formData;
    private BigDecimal rewardAmount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss" ) // 시간 이쁘게 보이기 위해 전처리
    private LocalDateTime deadline;

    private QuestStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // 2개씩 쓰는건 자리수 고정, 대문자와 소문자 의미 다름(겹치는거떔시)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    public static QuestResponseDto from(Quest quest, ObjectMapper objectMapper) {
        try {
            return QuestResponseDto.builder()
                    .id(quest.getId())
                    .managerId(quest.getManagerId().getId())
                    .title(quest.getTitle())
                    .formData(objectMapper.readTree(quest.getFormData()))
                    .rewardAmount(quest.getRewardAmount())
                    .deadline(quest.getDeadline())
                    .status(quest.getStatus())
                    .createdAt(quest.getCreatedAt())
                    .updatedAt(quest.getUpdatedAt())
                    .build();
        } catch(Exception e) {
            throw new RuntimeException("Quest formData 파싱 실패");
        }
    }

}
