package com.example.QuestWork.domain.quest.repository;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestSubmissionRepository extends JpaRepository<QuestSubmission, Long> {
    Optional<QuestSubmission> findByQuestAndMember(Quest quest, MemberProfileEntity member);
    List<QuestSubmission> findAllByQuest(Quest quest);
    List<QuestSubmission> findAllByMember(MemberProfileEntity member);

}
