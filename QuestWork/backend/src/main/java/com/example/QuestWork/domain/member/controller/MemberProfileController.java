package com.example.QuestWork.domain.member.controller;

import com.example.QuestWork.domain.member.dto.MemberPasswordUpdateDto;
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
        return ResponseEntity.ok(memberProfileService.getProfileByUsername(username));
    }

    /**
     * 프로필 일반 정보 수정 (닉네임, 소개글 등)
     */
    @PutMapping("/{username}")
    public ResponseEntity<String> updateProfile(@PathVariable String username, @RequestBody MemberUpdateDto dto) {
        memberProfileService.updateProfileByUsername(username, dto);
        return ResponseEntity.ok("수정 완료");
    }

    /**
     * 비밀번호 수정 (보안 강화)
     */
    @PatchMapping("/{username}/password") // 💡 경로 중복 제거!
    public ResponseEntity<?> updatePassword(
            @PathVariable String username,
            @RequestBody MemberPasswordUpdateDto dto) {

        // 💡 주입받은 memberProfileService를 사용하도록 수정
        memberProfileService.updatePassword(username, dto);
        return ResponseEntity.ok("비밀번호 변경 완료");
    }
}