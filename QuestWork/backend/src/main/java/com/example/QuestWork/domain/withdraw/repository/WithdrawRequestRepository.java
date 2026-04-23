package com.example.QuestWork.domain.withdraw.repository;


import com.example.QuestWork.domain.withdraw.entity.WithdrawRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {

    // 특정 유저(member_id)의 모든 출금 요청 내역을 최신순으로 가져오기
    List<WithdrawRequest> findByMemberIdOrderByRequestedAtDesc(Long memberId);

    // 특정 유저의 출금 상태별(예: REQUESTED, COMPLETED) 내역 필터링
    List<WithdrawRequest> findByMemberIdAndStatus(Long memberId, String status);
}