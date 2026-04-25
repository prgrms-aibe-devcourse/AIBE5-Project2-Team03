package com.example.QuestWork.domain.quest.controller;

import com.example.QuestWork.domain.quest.dto.*;
import com.example.QuestWork.domain.quest.service.ManagerQuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manager/quests")

public class ManagerQuestController {
    private final ManagerQuestService managerQuestService;


    //본인이 등록한 퀘스트 목록 조회
    @GetMapping
    public ResponseEntity<List<ManagerQuestResponseDto>> getMyQuests(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(managerQuestService.getMyQuests(userId));
    }

    //특정 퀘스트의 지원자 명단 조회
    @GetMapping("/{questId}/applicants")
    public ResponseEntity<List<QuestApplicantResponseDto>> getApplicants(
            @PathVariable Long questId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(managerQuestService.getApplicants(questId, userId));
    }


    //특정 퀘스트의 제출물(결과물) 목록 조회
    @GetMapping("/{questId}/submissions")
    public ResponseEntity<List<QuestSubmissionResponseDto>> getSubmissions(
            @PathVariable Long questId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(managerQuestService.getSubmissions(questId, userId));
    }


    //최종 우승자(선정자) 선택
    @PostMapping("/{questId}/winner")
    public ResponseEntity<QuestWinnerResponseDto> selectWinner(
            @PathVariable Long questId,
            @RequestParam Long userId,
            @Valid @RequestBody SelectWinnerRequestDto requestDto
    ) {
        QuestWinnerResponseDto response =
                managerQuestService.selectWinner(questId, userId, requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
