package com.example.QuestWork.domain.member.entity;


import com.example.QuestWork.domain.skill.entity.SkillTagEntity;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "member_skill_tags")
@Getter
@Setter
public class MemberSkillTagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private MemberProfileEntity memberProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_tag_id")
    private SkillTagEntity skillTag;

    private String level;

    private int yearsOfExperience;
}