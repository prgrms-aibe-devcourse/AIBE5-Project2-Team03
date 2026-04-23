package com.example.QuestWork.domain.quest.repository;

import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByStatus(QuestStatus status);
    List<Quest> findByManagerId(User managerId);
    List<Quest> findByManagerId_Id(Long managerProfileId);
}
