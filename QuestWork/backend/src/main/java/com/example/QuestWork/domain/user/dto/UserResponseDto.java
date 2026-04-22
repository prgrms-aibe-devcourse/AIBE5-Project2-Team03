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

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .username(user.getUsername())
                .build();
    }
}
