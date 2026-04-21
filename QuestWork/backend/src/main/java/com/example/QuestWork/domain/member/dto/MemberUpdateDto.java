package com.example.QuestWork.domain.member.dto;

import com.example.QuestWork.domain.member.constant.MemberLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberUpdateDto {
    // 사용자가 프로필 수정 페이지에서 직접 고칠 수 있는 항목들만 정의
    private String intro;           // 자기소개
    private String portfolioUrl;    // 포트폴리오 링크
    private MemberLevel level;           // 등급 (예: "SILVER")
    private int totalCareerYears;   // 경력 연차
}