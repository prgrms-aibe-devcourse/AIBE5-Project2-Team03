package com.example.QuestWork.domain.quest.service;

import com.example.QuestWork.domain.escrows.entity.Escrow;
import com.example.QuestWork.domain.escrows.repository.EscrowRepository;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.quest.dto.*;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestSubmission;
import com.example.QuestWork.domain.quest.entity.QuestWinner;
import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.repository.QuestApplicationRepository;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.quest.repository.QuestSubmissionRepository;
import com.example.QuestWork.domain.quest.repository.QuestWinnerRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class ManagerQuestService {
    private final QuestRepository questRepository;
    private final QuestApplicationRepository questApplicationRepository;
    private final QuestSubmissionRepository questSubmissionRepository;
    private final QuestWinnerRepository questWinnerRepository;
    private final ManagerProfileRepository managerProfileRepository;
    private final UserRepository userRepository;
    private final EscrowRepository escrowRepository;


    //본인이 등록한 모든 퀘스트 목록 조회
    public List<ManagerQuestResponseDto> getMyQuests(Long userId) {
        ManagerProfileEntity manager = getManagerProfile(userId);

        return questRepository.findAllByManagerId(manager)
                .stream().map(ManagerQuestResponseDto::from).toList();
    }
    //특정 퀘스트에 참여를 신청한 지원자 명단 조회
    public List<QuestApplicantResponseDto> getApplicants(Long questId, Long userId) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        return questApplicationRepository.findAllByQuest(quest)
                .stream().map(QuestApplicantResponseDto::from).toList();
    }

    //특정 퀘스트에 제출된 최종 결과물(과제) 목록 조회
    public List<QuestSubmissionResponseDto> getSubmissions(Long questId, Long userId) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        return questSubmissionRepository.findAllByQuest(quest)
                .stream()
                .map(QuestSubmissionResponseDto::from)
                .toList();
    }
    //퀘스트 우승자(최종 선정자) 확정
    @Transactional
    public QuestWinnerResponseDto selectWinner(Long questId, Long userId, SelectWinnerRequestDto requestDto) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        if (questWinnerRepository.existsByQuest(quest)) {
            throw new IllegalStateException("이미 최종 선정된 퀘스트입니다.");
        }

        QuestSubmission submission = questSubmissionRepository.findById(requestDto.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("제출 결과를 찾을 수 없습니다."));

        if (!submission.getQuest().getId().equals(quest.getId())) {
            throw new IllegalStateException("해당 퀘스트의 제출 결과가 아닙니다.");
        }

        QuestWinner winner = QuestWinner.create(quest, submission);
        QuestWinner savedWinner = questWinnerRepository.save(winner);

        // 제출물 상태를 WINNER로 변경
        submission.markAsWinner();
        questSubmissionRepository.save(submission);

        // 퀘스트 상태를 PICKED(우승자 선정 완료)로 변경
        quest.updateStatus(QuestStatus.PICKED);
        questRepository.save(quest);

        // 에스크로 생성 (아직 없는 경우만)
        if (!escrowRepository.existsByQuestId(questId)) {
            ManagerProfileEntity manager = getManagerProfile(userId);
            Escrow escrow = Escrow.builder()
                    .questId(questId)
                    .managerId(manager.getId())
                    .amount(quest.getRewardAmount())
                    .status("LOCKED")
                    .depositedAt(LocalDateTime.now())
                    .build();
            escrowRepository.save(escrow);
        }

        return QuestWinnerResponseDto.from(savedWinner);
    }


    //맴버가 소유하고 잇는 퀘스트인지 검증
    private Quest getQuestAndValidateOwner(Long questId, Long userId) {
        ManagerProfileEntity manager = getManagerProfile(userId);

        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("퀘스트를 찾을 수 없습니다"));

        if (!quest.getManagerId().getId().equals(manager.getId())) {
            throw new IllegalStateException("본인이 등록한 퀘스트만 관리할 수 있습니다.");
        }
        return quest;
    }
    //매니저 아이디 가져오기 - 없으면 자동 생성
    @Transactional
    private ManagerProfileEntity getManagerProfile(Long userId) {
        return managerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));
                    ManagerProfileEntity newProfile = ManagerProfileEntity.builder()
                            .user(user)
                            .managerType("INDIVIDUAL")
                            .approved(false)
                            .build();
                    return managerProfileRepository.save(newProfile);
                });
    }
}
