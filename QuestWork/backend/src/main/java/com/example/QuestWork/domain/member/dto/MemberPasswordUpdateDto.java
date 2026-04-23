package com.example.QuestWork.domain.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberPasswordUpdateDto {
    private String currentPassword;
    private String newPassword;
}