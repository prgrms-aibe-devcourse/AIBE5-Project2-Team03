package com.example.QuestWork.domain.quest.repository;

import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestWinner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestWinnerRepository extends JpaRepository<QuestWinner, Long> {
    boolean existsByQuest(Quest quest);
    Optional<QuestWinner> findByQuest(Quest quest);
}
