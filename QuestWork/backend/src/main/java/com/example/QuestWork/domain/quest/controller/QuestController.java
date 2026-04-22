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
@RequestMapping("api/quests")
@RequiredArgsConstructor

public class QuestController {

    private final QuestService questService;

    // 퀘스트 생성
    // POST /api/quests?managerId=1
    @PostMapping
    public ResponseEntity<QuestResponseDto> createQuest(
            @RequestParam Long managerId, @Valid @RequestBody QuestCreateRequestDto requestDto
    ) {
        QuestResponseDto response = questService.createQuest(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    // 퀘스트 하나 조회
    // GET /api/quests/1
    @GetMapping("/{questId}")
    public ResponseEntity<QuestResponseDto> getQuest(@PathVariable Long questId) {
        QuestResponseDto response = questService.getQuest(questId);
        return ResponseEntity.ok(response);
    }
    // 퀘스트 전체 조회
    // Get /api/quests
    @GetMapping
    public ResponseEntity<List<QuestResponseDto>> getAllQuests() {
        List<QuestResponseDto> response = questService.getAllQuests();
        return ResponseEntity.ok(response);
    }
    // 상태별 조회
    // GET /api/quests/status?status=OPEN
    @GetMapping("/status")
    public ResponseEntity<List<QuestResponseDto>> getQuestsByStatus(
            @RequestParam QuestStatus status) {
        List<QuestResponseDto> response = questService.getQuestByStatus(status);
        return ResponseEntity.ok(response);
    }

    // 매니저별 조회
    // GET /api/quests/manager/1
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<QuestResponseDto>> getQuestByManager(@PathVariable Long managerId) {
        List<QuestResponseDto> response = questService.getQuestByManager(managerId);
        return ResponseEntity.ok(response);
    }

    // 퀘스트 수정
    // PUT /api/quests/1?managerId=1
    @PutMapping("/{questId}")
    public ResponseEntity<QuestResponseDto> updateQuest(
            @PathVariable Long questId,
            @RequestParam Long managerId,
            @RequestBody QuestUpdateRequestDto requestDto
    ) {
        QuestResponseDto response = questService.updateQuest(questId, managerId, requestDto);
        return ResponseEntity.ok(response);
    }

    // 퀘스트 삭제
    // DELETE /api/quests/1?managerId=1
    @DeleteMapping("/{questId}")
    public ResponseEntity<Void> deleteQuest(
            @PathVariable Long questId,
            @RequestParam Long managerId
    ) {
        questService.deleteQuest(questId, managerId);
        return ResponseEntity.noContent().build();
    }

    // 퀘스트 상태 변경
    // PATCH /api/quests/1/status?managerId=1&status=CLOSED
    @PatchMapping("/{questId}/status")
    public ResponseEntity<QuestResponseDto> changeStatus(
            @PathVariable Long questId,
            @RequestParam Long managerId,
            @RequestParam QuestStatus status
    ) {
        QuestResponseDto response = questService.changeStatus(questId, managerId, status);
        return ResponseEntity.ok(response);
    }
}
