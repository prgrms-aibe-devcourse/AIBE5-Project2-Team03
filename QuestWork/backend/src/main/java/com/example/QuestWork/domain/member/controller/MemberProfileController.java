package com.example.QuestWork.domain.member.controller;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberSkillAddRequestDto;
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


}