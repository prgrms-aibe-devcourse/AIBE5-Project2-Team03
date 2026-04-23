package com.example.QuestWork.domain.member.repository;

import com.example.QuestWork.domain.member.entity.MemberSkillTagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberSkillTagRepository extends JpaRepository<MemberSkillTagEntity, Long> {
}
