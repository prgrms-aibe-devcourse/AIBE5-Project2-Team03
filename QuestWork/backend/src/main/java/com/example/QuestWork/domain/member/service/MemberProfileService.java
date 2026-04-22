package com.example.QuestWork.domain.member.service;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.entity.MemberSkillTagEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.member.repository.MemberSkillTagRepository;
import com.example.QuestWork.domain.member.repository.SkillTagRepository;
import com.example.QuestWork.domain.skill.SkillTagEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final SkillTagRepository skillTagRepository;
    private final MemberSkillTagRepository memberSkillTagRepository;

    public MemberProfileDto getProfile(String username) {
        MemberProfileEntity profile = memberProfileRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("해당 유저의 프로필을 찾을 수 없습니다: " + username));

        return MemberProfileDto.builder()
                .username(profile.getUser().getUsername())
                .nickname(profile.getUser().getNickname())
                // 1. 카멜케이스 메서드명 확인 (getProfile_image_url -> getProfileImageUrl)
                .profileImageUrl(profile.getUser().getProfile_image_url())
                .intro(profile.getIntro())
                // 2. Enum인 경우 .name() 추가
                .level(profile.getLevel() != null ? profile.getLevel().name() : null)
                .portfolioUrl(profile.getPortfolioUrl())
                .totalReward(profile.getTotalReward())
                .totalCareerYears(profile.getTotalCareerYears())
                .badgeCount(profile.getBadgeCount())
                // 3. Null 방지 처리 추가
                .techStack(profile.getSkillTags() == null ? java.util.Collections.emptyList() :
                        profile.getSkillTags().stream()
                                .map(mst -> mst.getSkillTag().getName())
                                .collect(Collectors.toList()))
                .build();
    }
    // MemberProfileService.java에 추가
    @Transactional // 조회와 달리 'readOnly = true'가 없어야 합니다.
    public void updateProfile(String username, MemberUpdateDto dto) {
        // 1. 기존 프로필 조회
        MemberProfileEntity profile = memberProfileRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("수정할 프로필을 찾을 수 없습니다."));

        // 2. 엔티티의 수정 메서드 호출
        profile.updateProfile(
                dto.getIntro(),
                dto.getLevel(),
                dto.getPortfolioUrl(),
                dto.getTotalCareerYears()
        );

        // 3. 별도의 save() 호출 없이도 트랜잭션 종료 시 DB에 반영됨
    }

    @Transactional
    public void addSkill(Long memberId, Long skillTagId) {
        // 1. memberId를 가지고 DB에서 회원(MemberProfileEntity)을 찾아옵니다.
        // 회원이 없으면 에러를 뱉도록 처리합니다.
        MemberProfileEntity member = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));

        // 2. skillTagId를 가지고 DB에서 기술(SkillTagEntity)을 찾아옵니다.
        SkillTagEntity skillTag = skillTagRepository.findById(skillTagId)
                .orElseThrow(() -> new IllegalArgumentException("해당 기술 스택을 찾을 수 없습니다."));

        // 3. 찾은 '회원'과 '기술'을 새로운 연결 상자(MemberSkillTagEntity)에 담아 묶어줍니다.
        MemberSkillTagEntity memberSkillTag = new MemberSkillTagEntity();
        memberSkillTag.setMemberProfile(member); // 백엔드 엔티티 구조에 따라 setter 이름이 다를 수 있습니다.
        memberSkillTag.setSkillTag(skillTag);

        // 4. 레포지토리를 사용해 DB에 최종적으로 저장합니다.
        memberSkillTagRepository.save(memberSkillTag);
    }

    public java.util.List<SkillTagEntity> getAllSkillTags() {
        return skillTagRepository.findAll();
    }

}