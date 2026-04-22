package com.example.QuestWork.domain.quest.repository;

import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestApplication;
import com.example.QuestWork.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestApplicationRepository extends JpaRepository<QuestApplication, Long> {
    boolean existsByQuestAndMember(Quest quest, User member);
    Optional<QuestApplication> findByQuestAndMember(Quest quest, User member);
    List<QuestApplication> findByQuest(Quest quest);
    List<QuestApplication> findByMember(User member);

}
