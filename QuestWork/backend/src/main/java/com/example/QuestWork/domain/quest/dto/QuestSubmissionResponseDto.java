package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.constant.SubmissionStatus;
import com.example.QuestWork.domain.quest.entity.QuestSubmission;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder

public class QuestSubmissionResponseDto {
    private Long submissionId;
    private Long questId;
    private Long memberId;

    private String submissionTitle;
    private String submissionContent;
    private String fileUrl;
    private String repoUrl;

    private Integer versionNo;
    private SubmissionStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    public static QuestSubmissionResponseDto from(QuestSubmission questSubmission) {
        return QuestSubmissionResponseDto.builder()
                .submissionId(questSubmission.getId())
                .questId(questSubmission.getQuest().getId())
                .memberId(questSubmission.getMember().getId())
                .submissionTitle(questSubmission.getSubmissionTitle())
                .submissionContent(questSubmission.getSubmissionContent())
                .fileUrl(questSubmission.getFileUrl())
                .repoUrl(questSubmission.getRepoUrl())
                .versionNo(questSubmission.getVersionNo())
                .status(questSubmission.getStatus())
                .submittedAt(questSubmission.getSubmittedAt())
                .updatedAt(questSubmission.getUpdatedAt())
                .build();
    }
}
