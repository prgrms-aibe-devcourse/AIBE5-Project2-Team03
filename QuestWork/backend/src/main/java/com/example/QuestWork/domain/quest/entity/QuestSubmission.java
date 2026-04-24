package com.example.QuestWork.domain.quest.entity;


import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.quest.constant.SubmissionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="quest_submissions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)


public class QuestSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quest_id")
    private Quest quest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private MemberProfileEntity member;

    @Column(name = "submission_title", nullable = false, length = 200)
    private String submissionTitle;

    @Lob
    @Column(name = "submission_content")
    private String submissionContent;

    @Column(name="file_url")
    private String fileUrl;

    @Column(name = "repo_url")
    private String repoUrl;

    @Column(name="version_no", nullable = false)
    @Builder.Default
    private Integer versionNo=1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.SUBMITTED;

    @CreatedDate
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void updateSubmission(
            String submissionTitle,
            String submissionContent,
            String fileUrl,
            String repoUrl
    ) {
        if (submissionTitle != null) this.submissionTitle = submissionTitle;
        if (submissionContent != null) this.submissionContent = submissionContent;
        if (fileUrl != null) this.fileUrl = fileUrl;
        if (repoUrl != null) this.repoUrl = repoUrl;

        this.versionNo = this.versionNo + 1;
        this.status = SubmissionStatus.UPDATED;

    }

    public static QuestSubmission create(
            Quest quest,
            MemberProfileEntity member,
            String submissionTitle,
            String submissionContent,
            String fileUrl,
            String repoUrl
    ) {
        return QuestSubmission.builder()
                .quest(quest)
                .member(member)
                .submissionTitle(submissionTitle)
                .submissionContent(submissionContent)
                .fileUrl(fileUrl)
                .repoUrl(repoUrl)
                .versionNo(1)
                .status(SubmissionStatus.SUBMITTED)
                .build();
    }







}
