package com.example.QuestWork.domain.skill;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "skill_tags")
@Getter
@Setter
public class SkillTagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // 예: "Java", "React"

    private String category; // 예: "BACKEND", "FRONTEND"

    private LocalDateTime createdAt;
}
