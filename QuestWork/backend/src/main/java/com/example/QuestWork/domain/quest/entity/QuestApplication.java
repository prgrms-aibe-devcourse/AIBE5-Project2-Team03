package com.example.QuestWork.domain.quest.entity;

import com.example.QuestWork.domain.quest.constant.ApplicationStatus;
import com.example.QuestWork.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "quest_applications",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_quest_application", columnNames = {"quest_id", "member_id"})
        }
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class QuestApplication {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch=FetchType.LAZY, optional = false)
        @JoinColumn(name="quest_id")
        private Quest quest;

        @ManyToOne(fetch=FetchType.LAZY, optional = false)
        @JoinColumn(name="member_id")
        private User member;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 50)
        @Builder.Default
        private ApplicationStatus status = ApplicationStatus.APPLIED;

        @CreatedDate
        @Column(name ="applied_at", nullable = false, updatable = false)
        private LocalDateTime appliedAt;

        public void cancel() {
                this.status = ApplicationStatus.CANCELED;
        }
}
