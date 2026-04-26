package com.example.QuestWork.domain.quest.dto;

import com.example.QuestWork.domain.quest.entity.QuestWinner;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder

public class QuestWinnerResponseDto {
    private Long winnerId;
    private Long questId;
    private Long submissionId;
    private Long memberId;
    private String nickname;
    private LocalDateTime selectedAt;
    private Boolean rewardConfirmed;

    public static QuestWinnerResponseDto from(QuestWinner winner) {
        return QuestWinnerResponseDto.builder()
                .winnerId(winner.getId())
                .questId(winner.getQuest().getId())
                .submissionId(winner.getSubmission().getId())
                .memberId(winner.getMember().getId())
                .nickname(winner.getMember().getUser().getNickname())
                .selectedAt(winner.getSelectedAt())
                .rewardConfirmed(winner.getRewardConfirmed())
                .build();
    }
}
