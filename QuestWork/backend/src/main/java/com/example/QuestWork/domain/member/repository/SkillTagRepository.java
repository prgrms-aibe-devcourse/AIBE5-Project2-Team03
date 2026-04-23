package com.example.QuestWork.domain.skill.repository;

import com.example.QuestWork.domain.skill.entity.SkillTagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillTagRepository extends JpaRepository<SkillTagEntity, Long> {
    List<SkillTagEntity> findByNameIn(List<String> names);
}