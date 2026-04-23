package com.example.QuestWork.domain.member.controller;

import com.example.QuestWork.domain.member.dto.MemberPasswordUpdateDto;
import com.example.QuestWork.domain.member.dto.MemberProfileDto;
<<<<<<< HEAD


import com.example.QuestWork.domain.member.dto.MemberSkillAddRequestDto;
=======
>>>>>>> origin/seokmin
import com.example.QuestWork.domain.member.dto.MemberUpdateDto;

import com.example.QuestWork.domain.member.service.MemberProfileService;
import com.example.QuestWork.domain.skill.SkillTagEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

<<<<<<< HEAD
    @PostMapping("/skills")
    public ResponseEntity<String> addSkillToMember(@RequestBody MemberSkillAddRequestDto request) {
        // 서비스(요리사)에게 스킬 추가 로직을 넘깁니다.
        memberProfileService.addSkill(request.getMemberId(), request.getSkillTagId());
        return ResponseEntity.ok("기술 스택이 성공적으로 등록되었습니다!");
    }

    @GetMapping("/skill-tags")
    public ResponseEntity<List<SkillTagEntity>> getSkillTags() {
        return ResponseEntity.ok(memberProfileService.getAllSkillTags());
    }


=======
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
>>>>>>> origin/seokmin
}