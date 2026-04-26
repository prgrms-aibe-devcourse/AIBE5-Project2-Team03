package com.example.QuestWork.domain.member.service;

import com.example.QuestWork.domain.member.dto.MemberPasswordUpdateDto;
import com.example.QuestWork.domain.member.dto.MemberProfileDto;
import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.entity.MemberSkillTagEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.skill.entity.SkillTagEntity;
import com.example.QuestWork.domain.skill.repository.SkillTagRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SkillTagRepository skillTagRepository;

    /**
     * 1. 마이페이지 프로필 조회 (ID 기반)
     */
    public MemberProfileDto getProfileById(Long id) {
        // [검증] 숫자로 된 ID로 유저 찾기
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저(ID: " + id + ")를 찾을 수 없습니다."));

        // [조회] 해당 유저의 프로필 엔티티 가져오기
        MemberProfileEntity profile = memberProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로필 정보를 찾을 수 없습니다."));

        return MemberProfileDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfile_image_url())
                .intro(profile.getIntro())
                .level(profile.getLevel() != null ? profile.getLevel().name() : null)
                .portfolioUrl(profile.getPortfolioUrl())
                .totalReward(profile.getTotalReward())
                .totalCareerYears(profile.getTotalCareerYears())
                .badgeCount(profile.getBadgeCount())
                .techStack(profile.getTechStacks() == null ? Collections.emptyList() :
                        profile.getTechStacks().stream()
                                .map(mste -> mste.getSkillTag().getName())
                                .collect(Collectors.toList()))
                .build();
    }

    /**
     * 2. 마이페이지 프로필 수정 (ID 기반)
     */
    @Transactional
    public void updateProfileById(Long id, MemberUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 유저를 찾을 수 없습니다."));

        // 닉네임 중복 체크
        if (dto.getNickname() != null && !dto.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(dto.getNickname())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(dto.getNickname());
        }

        MemberProfileEntity profile = memberProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로필 정보를 찾을 수 없습니다."));

        profile.updateProfile(
                dto.getIntro(),
                dto.getLevel(),
                dto.getPortfolioUrl(),
                dto.getTotalCareerYears()
        );

        // 기술 스택 업데이트
        if (dto.getTechStack() != null) {
            profile.getTechStacks().clear();
            memberProfileRepository.saveAndFlush(profile);

            List<SkillTagEntity> tags = skillTagRepository.findByNameIn(dto.getTechStack());
            List<MemberSkillTagEntity> skillRelations = tags.stream().map(tag -> {
                MemberSkillTagEntity relation = new MemberSkillTagEntity();
                relation.setSkillTag(tag);
                relation.setLevel("BEGINNER");
                relation.setYearsOfExperience(0);
                return relation;
            }).collect(Collectors.toList());

            profile.updateTechStacks(skillRelations);
        }
    }

    /**
     * 3. 비밀번호 수정 (ID 기반)
     */
    @Transactional
    public void updatePassword(Long id, MemberPasswordUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다.");
        }

        user.updatePassword(passwordEncoder.encode(dto.getNewPassword()));
    }
}