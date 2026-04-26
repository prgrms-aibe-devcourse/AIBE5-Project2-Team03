package com.example.QuestWork.domain.quest.controller;

import com.example.QuestWork.domain.quest.dto.QuestApplicationResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestStatsResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestSubmissionRequestDto;
import com.example.QuestWork.domain.quest.dto.QuestSubmissionResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestUpdateSubmissionRequestDto;
import com.example.QuestWork.domain.quest.service.QuestApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quests")

public class QuestApplicationController {
    private final QuestApplicationService questApplicationService;

    //지원 등록
    @PostMapping("/{questId}/applications")
    public ResponseEntity<QuestApplicationResponseDto> applyQuest(
            @PathVariable Long questId,
            @RequestParam Long userId
    ) {
        QuestApplicationResponseDto response = questApplicationService.applyQuest(questId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //지원 제출품 제출
    @PostMapping("/{questId}/submissions")
    public ResponseEntity<QuestSubmissionResponseDto> submitQuest(
            @PathVariable Long questId,
            @RequestParam Long userId,
            @Valid @RequestBody QuestSubmissionRequestDto requestDto
            ) {
       QuestSubmissionResponseDto response = questApplicationService.submitQuest(questId, userId, requestDto);
       return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    //지원 제출품 단건 조회
    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<QuestSubmissionResponseDto> getSubmission(
            @PathVariable Long submissionId
    ) {
        QuestSubmissionResponseDto response = questApplicationService.getSubmission(submissionId);
        return ResponseEntity.ok(response);
    }

    //지원 제출품 수정
    @PatchMapping("/submissions/{submissionId}")
    public ResponseEntity<QuestSubmissionResponseDto> updateQuest(
            @PathVariable Long submissionId,
            @RequestParam Long userId,
            @RequestBody QuestUpdateSubmissionRequestDto requestDto
    ) {
        QuestSubmissionResponseDto response = questApplicationService
                .updateSubmission(submissionId, userId, requestDto);
        return ResponseEntity.ok(response);
    }

    //내 지원 정보 조회 (퀘스트 + 유저 기준)
    @GetMapping("/{questId}/applications/me")
    public ResponseEntity<QuestApplicationResponseDto> getMyApplication(
            @PathVariable Long questId,
            @RequestParam Long userId
    ) {
        QuestApplicationResponseDto response = questApplicationService.getMyApplication(questId, userId);
        if (response == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(response);
    }

    //퀘스트 지원 삭제
    @PatchMapping("/applications/{applicationId}/cancel")
    public ResponseEntity<Void> cancelApplication(
            @PathVariable Long applicationId,
            @RequestParam Long userId
    ) {
        questApplicationService.cancelApplication(applicationId, userId);
        return ResponseEntity.noContent().build();
    }

    // 내가 지원한 퀘스트 목록 조회 (GET /api/quests/applied?userId=X)
    @GetMapping("/applied")
    public ResponseEntity<List<QuestResponseDto>> getMyAppliedQuests(@RequestParam Long userId) {
        List<QuestResponseDto> response = questApplicationService.getMyAppliedQuests(userId);
        return ResponseEntity.ok(response);
    }

    // 내가 제출한 모든 제출물 목록 조회 (GET /api/quests/my-submissions?userId=X)
    @GetMapping("/my-submissions")
    public ResponseEntity<List<QuestSubmissionResponseDto>> getMySubmissions(@RequestParam Long userId) {
        List<QuestSubmissionResponseDto> response = questApplicationService.getMySubmissions(userId);
        return ResponseEntity.ok(response);
    }

    // 퀘스트 공개 통계 조회 (GET /api/quests/{questId}/stats)
    @GetMapping("/{questId}/stats")
    public ResponseEntity<QuestStatsResponseDto> getQuestStats(@PathVariable Long questId) {
        QuestStatsResponseDto response = questApplicationService.getQuestStats(questId);
        return ResponseEntity.ok(response);
    }
}
