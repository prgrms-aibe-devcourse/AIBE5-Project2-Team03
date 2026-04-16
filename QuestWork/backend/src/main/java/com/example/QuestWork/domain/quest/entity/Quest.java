package com.example.QuestWork.domain.quest.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;

@Entity
@Table(name="quests")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class) // 생성 수정 시간 자동화, 다른 추가적인 기능들로 확장 가능 creaetedby
public class Quest {
    @Id
    @Column(name="manager_id")
    private Long managerId;

    @Column(name="title")
    private String title;

    @Column(name="form_data")
    private String form_data;

    @Column(name=reward_amount)
    private BigDecimal reward_amount;

}
