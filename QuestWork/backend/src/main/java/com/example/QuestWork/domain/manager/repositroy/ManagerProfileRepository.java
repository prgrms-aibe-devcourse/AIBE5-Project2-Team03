package com.example.QuestWork.domain.manager.repositroy;



import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerProfileRepository extends JpaRepository<ManagerProfileEntity, Long> {
    Optional<ManagerProfileEntity> findByUserId(Long userId);
    Optional<ManagerProfileEntity> findByUserUsername(String username);

}