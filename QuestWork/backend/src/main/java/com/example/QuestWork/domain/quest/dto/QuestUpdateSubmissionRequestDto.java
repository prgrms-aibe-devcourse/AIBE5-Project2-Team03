package com.example.QuestWork.domain.quest.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuestUpdateSubmissionRequestDto {

    @NotBlank
    private String SubmissionTitle;

    private String SubmissionContent;
    private String fileUrl;
    private String repoUrl;
}
