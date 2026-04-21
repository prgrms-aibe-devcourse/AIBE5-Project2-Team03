package com.example.QuestWork.domain.member.repository;



import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface MemberProfileRepository extends JpaRepository<MemberProfileEntity,Long> {

    // 유저네임으로 프로필과 유저 정보를 한 번에 가져오는 쿼리 (성능 최적화)
    @Query("select mp from MemberProfileEntity mp join fetch mp.user u where u.username = :username")
    Optional<MemberProfileEntity> findByUsername(@Param("username") String username);
}
