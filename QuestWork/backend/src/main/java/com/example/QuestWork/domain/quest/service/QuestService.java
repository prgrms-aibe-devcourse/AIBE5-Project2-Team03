package com.example.QuestWork.domain.quest.service;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.dto.QuestCreateRequestDto;
import com.example.QuestWork.domain.quest.dto.QuestResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestUpdateRequestDto;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class QuestService {
    private final QuestRepository questRepository;
    private final ManagerProfileRepository managerProfileRepository;
    private final WalletRepository walletRepository;
    private final ObjectMapper objectMapper;
    private final MemberProfileRepository memberProfileRepository;



    // 퀘스트 등록
    @Transactional
    public QuestResponseDto createQuest(QuestCreateRequestDto requestDto) {
        ManagerProfileEntity manager = managerProfileRepository.findByUserId(requestDto.getManagerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "매니저 프로필을 찾지 못했습니다"));

        //String formDataJson = toJsonString(requestDto.getFormData());

        Quest quest = Quest.builder()
                .managerId(manager)
                .title(requestDto.getTitle())
                .formData(requestDto.getFormData().toString())
                .rewardAmount(requestDto.getRewardAmount())
                .deadline(requestDto.getDeadline())
                .status(QuestStatus.OPEN)
                .build();

        Quest savedQuest = questRepository.save(quest);
        return QuestResponseDto.from(savedQuest, objectMapper);
        }
    // 퀘스트 하나 조회
    public QuestResponseDto getQuest(Long questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new EntityNotFoundException("퀘스트를 찾을 수 없습니다." + questId));
        return QuestResponseDto.from(quest, objectMapper);
    }
    // 퀘스트 전체 조회
    public List<QuestResponseDto> getAllQuests() {
        return questRepository.findAll().stream().map(quest -> QuestResponseDto
                .from(quest, objectMapper)).toList();
    }

    //상태별 퀘스트 조회
    public List<QuestResponseDto> getQuestByStatus(QuestStatus status) {
        return questRepository.findByStatus(status)
                .stream().map(quest -> QuestResponseDto.from(quest, objectMapper)).toList();
    }

    //작성자별 퀘스트 조회
    public List<QuestResponseDto> getQuestByManager(Long userId) {
        // 1. 유저 ID로 매니저 프로필 찾기
        ManagerProfileEntity managerProfile = managerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("매니저 프로필 없음: " + userId));

        // 2. 💡 새로 만든 findByManagerId_Id 메소드 사용 (Long 타입 전달)
        return questRepository.findByManagerId_Id(managerProfile.getId())
                .stream()
                .map(quest -> QuestResponseDto.from(quest, objectMapper))
                .toList();
    }
    //퀘스트 수정
    @Transactional
    public QuestResponseDto updateQuest(Long questId, Long managerId, QuestUpdateRequestDto requestDto) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new EntityNotFoundException("퀘스트를 찾을 수 없습니다." + questId));
        validateQuestOwner(quest, managerId);
        quest.update(
                requestDto.getTitle(),
                requestDto.getFormData().toString(),
                requestDto.getRewardAmount(),
                requestDto.getDeadline(),
                requestDto.getStatus()
        );
        return QuestResponseDto.from(quest, objectMapper);
    }


    //퀘스트 삭제
    @Transactional
    public void deleteQuest(Long questId, Long managerId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new EntityNotFoundException("퀘스트를 찾을 수 없습니다." + questId));

        validateQuestOwner(quest, managerId);
        questRepository.delete(quest);
    }
    //퀘스트 상태변경
    @Transactional
    public QuestResponseDto changeStatus(Long questId, Long managerId, QuestStatus status) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new EntityNotFoundException("퀘스트를 찾을 수 없습니다." + questId));
        validateQuestOwner(quest, managerId);
        quest.updateStatus(status);
        quest.update(null, null, null, null, status);
        return QuestResponseDto.from(quest, objectMapper);
    }
    //작성자 검증 (managerId 파라미터는 users.id)
    public void validateQuestOwner(Quest quest, Long managerId) {
        if(!quest.getManagerId().getUser().getId().equals(managerId)) {
            throw new IllegalArgumentException("해당 퀘스트에 대한 수정 권한이 없습니다");
        }
    }

    /**
     * 매니저별 퀘스트 조회 (현재 로그인한 유저 ID 기준)
     * 💡 컨트롤러의 /api/quests/manager/{userId} 와 연결됩니다.
     */

    @Transactional
    public void completeQuestAndPayReward(Long questId, Long winnerId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 퀘스트입니다."));

        // 1. 상태 변경
        quest.setStatus(QuestStatus.COMPLETED);

        // 2. 보상 금액 가져오기
        // 💡 정답: 이제 rewardAmount가 이미 BigDecimal이므로 valueOf가 필요 없습니다!
        BigDecimal reward = quest.getRewardAmount();

        // 3. 지갑 잔액 추가
        WalletEntity wallet = walletRepository.findByUserId(winnerId)
                .orElseThrow(() -> new IllegalArgumentException("유저의 지갑을 찾을 수 없습니다."));

        BigDecimal currentBalance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;

        // 💡 여기서 currentBalance(BigDecimal) + reward(BigDecimal) 계산이 완벽하게 맞물립니다.
        wallet.setBalance(currentBalance.add(reward));

        // 4. 프로필 누적 수익 업데이트
        MemberProfileEntity profile = memberProfileRepository.findByUserId(winnerId)
                .orElseThrow(() -> new IllegalArgumentException("프로필 정보가 없습니다."));

        BigDecimal currentTotal = profile.getTotalReward() != null ? profile.getTotalReward() : BigDecimal.ZERO;
        profile.setTotalReward(currentTotal.add(reward));
    }
}
