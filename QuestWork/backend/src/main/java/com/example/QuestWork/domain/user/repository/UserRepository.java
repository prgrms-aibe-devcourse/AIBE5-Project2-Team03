package com.example.QuestWork.domain.user.repository;

import com.example.QuestWork.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    // UserRepository.java
    Optional<User> findByUsername(String username); // n을 소문자로!
    // UserRepository.java

    // 1. 기존 권한 삭제
    @Modifying
    @Query(value = "DELETE FROM user_roles WHERE user_id = :userId", nativeQuery = true)
    void deleteUserRolesNative(@Param("userId") Long userId);

    // 2. 새 권한 삽입 (roles 테이블의 'name' 컬럼과 비교)
    @Modifying
    @Query(value = "INSERT INTO user_roles (user_id, role_id) " +
            "VALUES (:userId, (SELECT id FROM roles WHERE name = :roleName))", nativeQuery = true)
    void insertUserRoleNative(@Param("userId") Long userId, @Param("roleName") String roleName);

    @Query(value = "SELECT r.name FROM roles r " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = :userId",
            nativeQuery = true)
    String findRoleNameByUserId(@Param("userId") Long userId);

    boolean existsByNickname(String nickname);
}
