package com.example.QuestWork.domain.quest.service;

import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.dto.QuestCreateRequestDto;
import com.example.QuestWork.domain.quest.dto.QuestResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestUpdateRequestDto;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class QuestService {
    private final QuestRepository questRepository;
    private final UserRepository userRepository;
    private final ManagerProfileRepository managerProfileRepository;
    private final ObjectMapper objectMapper;


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
    public List<QuestResponseDto> getQuestByManager(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("해당 매니저를 찾지 못했습니다" + managerId));

        return questRepository.findByManagerId(manager)
                .stream().map(quest -> QuestResponseDto.from(quest, objectMapper)).toList();
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
    //작성자 검증
    public void validateQuestOwner(Quest quest, Long mangerId) {
        if(!quest.getManagerId().getId().equals(mangerId)) {
            throw new IllegalArgumentException("해당 퀘스트에 대한 수정 권환이 없습니다");
        }
    }

}
