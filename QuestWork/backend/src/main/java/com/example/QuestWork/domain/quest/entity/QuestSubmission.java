package com.example.QuestWork.domain.quest.entity;


import com.example.QuestWork.domain.quest.constant.SubmissionStatus;
import com.example.QuestWork.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.java.Log;
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
    private User member;

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

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void updateSubmission(
            String submissionTitle,
            String submissionContext,
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





}
