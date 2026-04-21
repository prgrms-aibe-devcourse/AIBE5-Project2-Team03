package com.example.QuestWork.domain.admin.service;



import com.example.QuestWork.domain.admin.dto.AdminUserResponseDto;
import com.example.QuestWork.domain.role.repository.RoleRepository;
import com.example.QuestWork.domain.user.constant.UserStatus;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.relation.Role;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;


    @Transactional(readOnly = true)
    public Page<AdminUserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> {
            // DB에서 해당 유저의 권한 이름을 조회
            String roleName = userRepository.findRoleNameByUserId(user.getId());

            return AdminUserResponseDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .status(user.getStatus())
                    .roleName(roleName != null ? roleName : "MEMBER") // 권한이 없으면 기본값 MEMBER
                    .createdAt(user.getCreatedAt())
                    .build();
        });
    }
    // 두 번째 인자를 Enum 타입인 UserStatus로 직접 받습니다.
    public void updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // status는 이미 Enum이므로 .getStatus()를 호출할 필요가 없습니다.
        user.changeStatus(status);

        // 3. repository.save()를 부르지 않아도 메서드 종료 시(트랜잭션 끝) DB 반영!
    }

    @Transactional
    public void updateUserRole(Long userId, String roleName) {
        // 1. 기존 권한 지우고
        userRepository.deleteUserRolesNative(userId);

        // 2. 새로운 권한(예: ADMIN)으로 다시 연결!
        userRepository.insertUserRoleNative(userId, roleName);
    }

}