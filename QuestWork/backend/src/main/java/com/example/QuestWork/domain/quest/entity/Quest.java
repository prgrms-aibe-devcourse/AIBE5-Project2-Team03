package com.example.QuestWork.domain.quest.entity;


import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.quest.constant.QuestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="quests")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class) // 생성 수정 시간 자동화, 다른 추가적인 기능들로 확장 가능 creaetedby
public class Quest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "manager_id", nullable = false)
    private ManagerProfileEntity managerId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name="form_data", columnDefinition = "json", nullable = false)
    private String formData;

    @Column(precision = 12, scale = 2) // DB에도 decimal로 생성됨
    private BigDecimal rewardAmount; // Long 대신 BigDecimal 사용

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Builder.Default
    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private QuestStatus status = QuestStatus.OPEN;

    @CreatedDate
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void update(
            String title,
            String formData,
            BigDecimal rewardAmount,
            LocalDateTime deadline,
            QuestStatus status
    )    {
        if (title != null) this.title = title;
        if (formData != null) this.formData = formData;
        if (rewardAmount != null) this.rewardAmount = rewardAmount;
        if (deadline != null) this.deadline = deadline;
        if (status != null) this.status = status;
    }

    public void updateStatus(QuestStatus status) {
        this.status = status;
    }

    // 직접 만드시는 setStatus 메서드
    public void setStatus(QuestStatus questStatus) {
        this.status = questStatus;
    }
}
