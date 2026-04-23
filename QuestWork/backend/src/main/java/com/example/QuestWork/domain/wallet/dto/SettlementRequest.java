package com.example.QuestWork.domain.wallet.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 정산 요청을 담는 바구니 (DTO)
 */
@Getter
@NoArgsConstructor // JSON 파싱을 위해 기본 생성자 필요
@AllArgsConstructor // 테스트나 코드 내 생성을 위해 전체 생성자 추가
public class SettlementRequest {
    private Long questId;          // 어떤 퀘스트인지
    private Long freelancerId;     // 돈을 받을 사람(프리랜서) ID
    private Long originalAmount;   // 원래 지급해야 할 원금 (수수료 떼기 전!)
}