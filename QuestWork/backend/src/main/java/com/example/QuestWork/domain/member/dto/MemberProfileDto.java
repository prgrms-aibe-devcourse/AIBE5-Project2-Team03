package com.example.QuestWork.domain.member.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberProfileDto {
    // 1. 유저 기본 정보 (User 엔티티와 조인해서 가져올 내용)
    private String username;        // 식별용 ID (@kim-dev)
    private String nickname;        // 표시될 이름 (김개발)
    private String profileImageUrl; // 프로필 이미지 경로

    // 2. 프로필 상세 정보 (MemberProfileEntity 내용)
    private String intro;           // 자기소개 (Bio)
    private String portfolioUrl;    // 포트폴리오 링크
    private String level;           // 등급 (BRONZE, SILVER 등)
    private int totalCareerYears;   // 경력 연차

    // 3. 통계 및 실적 데이터
    private BigDecimal totalReward; // 총 수익 (₩8,450,000)
    private int completedQuestsCount; // 완료한 퀘스트 수 (BadgeCount 등을 활용)

    // 4. 연관 리스트 데이터
    private List<String> techStack; // 기술 스택 이름 리스트 (["React", "Spring"])

    private int badgeCount;

    // 선택 사항: 아직 구현 전이라면 빈 리스트로 전달
    // private List<QuestDto> completedQuests;
}