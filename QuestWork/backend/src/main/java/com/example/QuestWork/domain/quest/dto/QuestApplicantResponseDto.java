package com.example.QuestWork.domain.quest.dto;


import com.example.QuestWork.domain.quest.entity.QuestApplication;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder

public class QuestApplicantResponseDto {

    private Long applicationId;
    private Long memberId;
    private String nickname;
    private String portfolioUrl;
    private String intro;
    private String status;
    private LocalDateTime appliedAt;

    public static QuestApplicantResponseDto from(QuestApplication application) {
        return QuestApplicantResponseDto.builder()
                .applicationId(application.getId())
                .memberId(application.getMember().getId())
                .nickname(application.getMember().getUser().getNickname())
                .portfolioUrl(application.getMember().getPortfolioUrl())
                .intro(application.getMember().getIntro())
                .status(application.getStatus().name())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
