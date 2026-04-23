package com.example.QuestWork.domain.user.service;

import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.member.constant.MemberLevel;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.user.dto.UserLoginRequestDto;
import com.example.QuestWork.domain.user.dto.UserRequestDto;
import com.example.QuestWork.domain.user.dto.UserResponseDto;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // 💡 아래 레포지토리들이 반드시 추가되어야 합니다.
    private final MemberProfileRepository memberProfileRepository;
    private final ManagerProfileRepository managerProfileRepository;

    @Transactional(readOnly=true)
    public UserResponseDto login(UserLoginRequestDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다"));
        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다"); }
        System.out.println("로그인 유저: " + user.getNickname() + ", 권한들: " + user.getRoleIds());
        return UserResponseDto.from(user);
    }

    @Transactional
    public void signUp(UserRequestDto dto) {
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        User user = userRepository.save(dto.toUserEntity(encodedPassword));

        String roleType = dto.getRoleType();
        System.out.println("전달된 roleType: [" + roleType + "]");

        // 1. [공통] 어떤 역할이든 '기본 멤버 프로필'은 생성합니다.
        // (매니저도 활동을 하려면 기본 프로필 정보가 필요하니까요!)
        MemberProfileEntity memberProfile = MemberProfileEntity.builder()
                .user(user)
                .level(MemberLevel.BRONZE)
                .badgeCount(0)
                .totalReward(BigDecimal.ZERO)
                .build();
        memberProfileRepository.save(memberProfile);

        // 2. 역할에 따른 권한 부여 및 추가 프로필 생성
        if (roleType != null && roleType.trim().equalsIgnoreCase("MANAGER")) {
            // 매니저 권한 부여
            userRepository.insertUserRoleNative(user.getId(), "MANAGER");

            // 매니저 추가 프로필 생성
            ManagerProfileEntity managerProfile = ManagerProfileEntity.builder()
                    .user(user)
                    .managerType(dto.getManagerType())
                    .companyName(dto.getCompanyName())
                    .managerType(dto.getManagerType() != null ? dto.getManagerType() : "COMPANY")
                    .businessNumber(dto.getBusinessNumber())
                    .managerName(dto.getManagerName())     // 👈 DTO에서 꺼내서 주입
                    .contact_phone(dto.getContactPhone()) // 👈 DTO에서 꺼내서 주입
                    .approved(false)
                    .build();
            managerProfileRepository.save(managerProfile);

            System.out.println("매니저 및 기본 멤버 프로필 생성 완료");
        } else {
            // 일반 멤버 권한 부여
            userRepository.insertUserRoleNative(user.getId(), "MEMBER");
            System.out.println("일반 멤버 프로필 생성 완료");
        }
    }
    }