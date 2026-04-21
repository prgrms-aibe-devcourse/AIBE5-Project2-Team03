package com.example.QuestWork.domain.user.dto;

import com.example.QuestWork.domain.user.constant.UserStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserStatusUpdateDto {
    private UserStatus status; // ACTIVE, INACTIVE, DELETED 중 하나가 들어옴
}