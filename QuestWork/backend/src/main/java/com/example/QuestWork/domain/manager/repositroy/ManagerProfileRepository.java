package com.example.QuestWork.domain.manager.repositroy;



import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagerProfileRepository extends JpaRepository<ManagerProfileEntity, Long> {
// 필요 시 특정 유저의 프로필을 찾는 메서드를 추가할 수 있습니다.
// Optional<ManagerProfile> findByUserId(Long userId);
}