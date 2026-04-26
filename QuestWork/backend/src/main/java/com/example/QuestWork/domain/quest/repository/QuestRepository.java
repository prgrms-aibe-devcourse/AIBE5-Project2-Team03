package com.example.QuestWork.domain.quest.repository;

import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.entity.Quest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByStatus(QuestStatus status);
    List<Quest> findByManagerId(ManagerProfileEntity managerId);
    List<Quest> findByManagerId_Id(Long managerProfileId);
    List<Quest> findAllByManagerId(ManagerProfileEntity manager);

    @Query("SELECT COUNT(q) FROM Quest q WHERE q.status IN ('OPEN', 'IN_PROGRESS')")
    long countActiveQuests();
}
