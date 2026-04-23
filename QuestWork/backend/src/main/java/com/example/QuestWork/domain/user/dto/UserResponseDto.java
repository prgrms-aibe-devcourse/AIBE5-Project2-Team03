package com.example.QuestWork.domain.user.dto;

import com.example.QuestWork.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private String username;
    private String role;

    public static UserResponseDto from(User user) {
        // 기본값은 MEMBER
        String displayRole = "MEMBER";

        // 💡 쿼리문 기준: roles 테이블의 ID 9번이 MANAGER라면
        if (user.getRoleIds() != null) {
            if (user.getRoleIds().contains(7L)) {
                displayRole = "ADMIN";   // 7번이면 ADMIN
            } else if (user.getRoleIds().contains(9L)) {
                displayRole = "MANAGER"; // 9번이면 MANAGER
            }
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .username(user.getUsername())
                .role(displayRole) // 👈 여기서 가방에 "MANAGER"를 쏙 넣어줍니다.
                .build();
    }
}
