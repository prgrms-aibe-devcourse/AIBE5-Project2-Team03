package com.example.QuestWork.domain.quest.entity;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="quest_winners")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)


public class QuestWinner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quest_id", nullable = false, unique = true)
    private Quest quest;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private QuestSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfileEntity member;

    @CreatedDate
    @Column(name = "selected_at", nullable = false, updatable = false)
    private LocalDateTime selectedAt;

    @Column(name = "reward_confirmed", nullable = false)
    @Builder.Default
    private Boolean rewardConfirmed = false;

    public static QuestWinner create(Quest quest, QuestSubmission submission) {
        return QuestWinner.builder()
                .quest(quest)
                .submission(submission)
                .member(submission.getMember())
                .rewardConfirmed(false)
                .build();
    }
}
