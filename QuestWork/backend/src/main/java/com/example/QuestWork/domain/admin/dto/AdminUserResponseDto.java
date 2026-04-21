package com.example.QuestWork.domain.admin.dto;

import com.example.QuestWork.domain.user.constant.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminUserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private UserStatus status;      // ACTIVE, INACTIVE, DELETED
    private String roleName; // 💡 권한 이름을 담을 필드 추가
    private LocalDateTime createdAt; // 가입일
}