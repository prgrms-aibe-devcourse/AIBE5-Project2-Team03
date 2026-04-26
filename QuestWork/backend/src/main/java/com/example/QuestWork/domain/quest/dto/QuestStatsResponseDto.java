package com.example.QuestWork.domain.quest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestStatsResponseDto {
    private long applicantCount;
    private long submissionCount;
    private long reviewingCount;
    private long selectedCount;
}
