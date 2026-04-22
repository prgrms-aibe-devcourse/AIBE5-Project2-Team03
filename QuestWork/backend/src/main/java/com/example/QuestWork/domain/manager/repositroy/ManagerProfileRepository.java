package com.example.QuestWork.domain.manager.repositroy;



import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagerProfileRepository extends JpaRepository<ManagerProfileEntity, Long> {
    java.util.Optional<ManagerProfileEntity> findByUserId(Long userId);
}