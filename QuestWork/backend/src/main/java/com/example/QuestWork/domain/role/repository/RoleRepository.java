package com.example.QuestWork.domain.role.repository;

import com.example.QuestWork.domain.role.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity,Long> {
    /**
     * 역할 이름(ADMIN, MANAGER, MEMBER 등)으로 권한 엔티티 조회
     * @param name 권한 이름
     * @return RoleEntity (Optional)
     */
    Optional<RoleEntity> findByName(String name);

    /**
     * 해당 이름의 권한이 존재하는지 확인
     */
    boolean existsByName(String name);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = :roleName) WHERE id = :userId", nativeQuery = true)
    void updateRoleByRoleName(@Param("userId") Long userId, @Param("roleName") String roleName);
}
