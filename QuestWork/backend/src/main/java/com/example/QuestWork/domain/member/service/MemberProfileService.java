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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final UserRepository userRepository; // 👈 추가 필요
    private final PasswordEncoder passwordEncoder;
    private final SkillTagRepository skillTagRepository;

    /**
     * 1. 마이페이지 프로필 조회 (단순 조회용)
     */
    @Transactional(readOnly = true)
    public MemberProfileDto getProfileByUsername(String username) {
        // [검증] 주소창의 username으로 유저가 존재하는지 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저를 찾을 수 없습니다."));

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
                // 💡 중간 엔티티(MemberSkillTagEntity)를 거쳐서 이름을 가져오도록 수정
                .techStack(profile.getTechStacks() == null ? java.util.Collections.emptyList() :
                        profile.getTechStacks().stream()
                                .map(mste -> mste.getSkillTag().getName()) // mste(중간객체) -> SkillTag -> Name
                                .collect(Collectors.toList()))
                .build();
    }

    /**
     * 2. 마이페이지 프로필 수정 (닉네임 중복 검증 포함)
     * 스킬태그 수정
     */
    @Transactional
    public void updateProfileByUsername(String username, MemberUpdateDto dto) {
        // [검증 1] 수정하려는 대상 유저가 존재하는지 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 유저를 찾을 수 없습니다."));

        // [검증 2] 닉네임 변경 시 중복 체크
        if (dto.getNickname() != null && !dto.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(dto.getNickname())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(dto.getNickname());
        }

        // [수정] 프로필 엔티티 찾아서 업데이트
        MemberProfileEntity profile = memberProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로필 정보를 찾을 수 없습니다."));

        profile.updateProfile(
                dto.getIntro(),
                dto.getLevel(),
                dto.getPortfolioUrl(),
                dto.getTotalCareerYears()
        );
        // 3. 💡 기술 스택(techStack) 업데이트 로직 추가
        if (dto.getTechStack() != null) {
            // 기존에 저장된 기술 스택 관계(MemberSkillTagEntity)를 먼저 완전히 비워줍니다.
            // orphanRemoval = true 설정이 되어 있다면 clear()만으로도 DB에서 삭제됩니다.
            profile.getTechStacks().clear();

            // 변경 사항을 DB에 먼저 반영하여 중복 체크 에러를 방지합니다.
            memberProfileRepository.saveAndFlush(profile);

            List<SkillTagEntity> tags = skillTagRepository.findByNameIn(dto.getTechStack());
            // 2. 중간 엔티티(MemberSkillTagEntity) 리스트로 변환
            List<MemberSkillTagEntity> skillRelations = tags.stream().map(tag -> {
                MemberSkillTagEntity relation = new MemberSkillTagEntity();
                relation.setSkillTag(tag); // 여기서 tag가 확실히 있는지 확인!
                relation.setLevel("BEGINNER"); // 숙련도 기본값
                relation.setYearsOfExperience(0); // 해당 기술 경력 기본값 (0년)
                return relation;
            }).collect(Collectors.toList());

            // 3. 프로필에 반영
            profile.updateTechStacks(skillRelations);
        }
    }
    @Transactional
    public void updatePassword(String username, MemberPasswordUpdateDto dto) {
        // 1. 유저 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // 2. 현재 비밀번호 확인
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 3. 새 비밀번호 암호화 및 DB 반영
        String encryptedPassword = passwordEncoder.encode(dto.getNewPassword());
        user.updatePassword(encryptedPassword);

        // @Transactional에 의해 메서드 종료 시 DB에 반영(commit)됩니다.
    }
    }