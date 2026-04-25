package com.example.QuestWork.domain.quest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class SelectWinnerRequestDto {
    @NotNull
    private Long submissionId;
}
