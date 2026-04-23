package com.example.QuestWork.domain.manager.service;

import com.example.QuestWork.domain.manager.dto.ManagerProfileResponseDto;
import com.example.QuestWork.domain.manager.dto.ManagerUpdateRequestDto;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ManagerProfileService {
    private final ManagerProfileRepository managerProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ManagerProfileResponseDto getManagerProfile(Long userId) {
        return managerProfileRepository.findByUserId(userId)
                .map(ManagerProfileResponseDto::from)
                .orElseGet(() -> {
                    // 💡 DTO에 기본 생성자가 없다면 builder나 모든 필드 생성자를 써야 합니다.
                    // 만약 DTO에 @NoArgsConstructor가 없다면 에러가 날 수 있으니 확인해주세요!
                    return new ManagerProfileResponseDto();
                });
    }

    public void updateManagerProfile(Long userId, ManagerUpdateRequestDto dto) {
        ManagerProfileEntity profile = managerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

                    // 💡 new 대신 Builder를 사용하여 PROTECTED 생성자 우회 및 초기화
                    ManagerProfileEntity newProfile = ManagerProfileEntity.builder()
                            .user(user)
                            .managerType("INDIVIDUAL") // 필수 필드 초기화
                            .approved(false)
                            .build();

                    return managerProfileRepository.save(newProfile);
                });

        // 닉네임 수정 (User 엔티티)
        if (dto.getNickname() != null && profile.getUser() != null) {
            profile.getUser().setNickname(dto.getNickname());
        }

        // 매니저 정보 업데이트
        profile.updateManagerInfo(
                dto.getManagerName(),
                dto.getCompanyName(),
                dto.getContactPhone(),
                dto.getBusinessNumber()
        );
    }
}