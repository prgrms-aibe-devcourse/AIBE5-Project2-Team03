package com.example.QuestWork.domain.member.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class MemberSkillAddRequestDto {
    private Long memberId; // 스킬을 추가할 회원 고유 번호
    private Long skillTagId; // 추가할 기술 스택 고유 번호
}
