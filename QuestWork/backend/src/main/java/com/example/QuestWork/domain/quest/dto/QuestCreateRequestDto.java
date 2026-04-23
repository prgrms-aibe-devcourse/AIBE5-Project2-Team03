package com.example.QuestWork.domain.quest.dto;


import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter

public class QuestCreateRequestDto {

    @NotNull
    private Long managerId;

    @NotBlank
    private String title;

    @NotNull
    private JsonNode formData;

    @NotNull
    @DecimalMin(value="0.0", inclusive = false )
    private BigDecimal rewardAmount;

    @NotNull
    @FutureOrPresent
    private LocalDateTime deadline;
}
