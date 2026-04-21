package com.example.QuestWork.domain.member.controller;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.service.MemberProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class MemberProfileController {

    private final MemberProfileService memberProfileService;

    /**
     * 마이페이지 프로필 조회
     */
    @GetMapping("/{username}")
    public ResponseEntity<MemberProfileDto> getProfile(@PathVariable String username) {
        MemberProfileDto profile = memberProfileService.getProfile(username);
        return ResponseEntity.ok(profile);
    }
    @PutMapping("/{username}")
    public ResponseEntity<String> updateProfile(
            @PathVariable("username") String username,
            @RequestBody MemberUpdateDto updateDto) { // JSON 데이터를 DTO로 자동 변환

        memberProfileService.updateProfile(username, updateDto);

        return ResponseEntity.ok("프로필 수정이 완료되었습니다.");
    }
}