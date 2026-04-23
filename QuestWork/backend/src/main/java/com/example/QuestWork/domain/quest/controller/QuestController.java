package com.example.QuestWork.domain.quest.controller;


import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.dto.QuestCreateRequestDto;
import com.example.QuestWork.domain.quest.dto.QuestResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestUpdateRequestDto;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.service.QuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quests") // 💡 경로 앞에 / 추가
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    // 1. 퀘스트 생성
    @PostMapping
    public ResponseEntity<QuestResponseDto> createQuest(
            @Valid @RequestBody QuestCreateRequestDto requestDto
    ) {
        // DTO 안에 이미 managerId가 포함되어 있으므로 RequestParam은 생략 가능합니다.
        QuestResponseDto response = questService.createQuest(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. 퀘스트 전체 조회
    @GetMapping
    public ResponseEntity<List<QuestResponseDto>> getAllQuests() {
        return ResponseEntity.ok(questService.getAllQuests());
    }

    // 3. 퀘스트 하나 조회 (충돌 방지를 위해 id를 경로 변수로 유지)
    @GetMapping("/detail/{questId}") // 💡 /detail을 붙여서 경로를 확실히 구분합니다.
    public ResponseEntity<QuestResponseDto> getQuest(@PathVariable Long questId) {
        return ResponseEntity.ok(questService.getQuest(questId));
    }

    // 4. 상태별 조회
    @GetMapping("/filter/status") // 💡 /filter/status 등으로 명확하게 변경
    public ResponseEntity<List<QuestResponseDto>> getQuestsByStatus(
            @RequestParam QuestStatus status) {
        return ResponseEntity.ok(questService.getQuestByStatus(status));
    }

    // 5. 매니저별 조회 (현재 로그인한 유저의 퀘스트 목록 - 캘린더용)
    @GetMapping("/manager/{userId}")
    public ResponseEntity<List<QuestResponseDto>> getQuestByManager(@PathVariable Long userId) {
        return ResponseEntity.ok(questService.getQuestByManager(userId));
    }

    // 6. 퀘스트 수정
    @PutMapping("/{questId}")
    public ResponseEntity<QuestResponseDto> updateQuest(
            @PathVariable Long questId,
            @RequestParam Long managerId, // 💡 검증용 userId
            @RequestBody QuestUpdateRequestDto requestDto
    ) {
        return ResponseEntity.ok(questService.updateQuest(questId, managerId, requestDto));
    }

    // 7. 퀘스트 삭제
    @DeleteMapping("/{questId}")
    public ResponseEntity<Void> deleteQuest(
            @PathVariable Long questId,
            @RequestParam Long managerId
    ) {
        questService.deleteQuest(questId, managerId);
        return ResponseEntity.noContent().build();
    }

    // 8. 퀘스트 상태 변경
    @PatchMapping("/{questId}/status")
    public ResponseEntity<QuestResponseDto> changeStatus(
            @PathVariable Long questId,
            @RequestParam Long managerId,
            @RequestParam QuestStatus status
    ) {
        return ResponseEntity.ok(questService.changeStatus(questId, managerId, status));
    }
}