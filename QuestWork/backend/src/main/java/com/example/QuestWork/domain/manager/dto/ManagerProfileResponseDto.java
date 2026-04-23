package com.example.QuestWork.domain.manager.dto;

import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import lombok.*;

@Data
@NoArgsConstructor  // 💡 1. 이게 있어야 'new ManagerProfileResponseDto()' 에러가 사라집니다.
@AllArgsConstructor // 💡 2. 빌더나 전체 인자 생성자를 위해 필요합니다.
@Builder            // 💡 3. 하단 from 메서드에서 .builder()를 쓰기 위해 필요합니다.
public class ManagerProfileResponseDto {
    private String username;      // 아이디
    private String nickname;      // 유저 닉네임
    private String managerName;   // 담당자 이름
    private String companyName;   // 회사명
    private String contactPhone;  // 담당자 연락처 (DB 필드명이 contact_phone이어도 DTO는 카멜케이스 권장)
    private String businessNumber;// 사업자 번호
    private String managerType;   // 매니저 타입 (COMPANY, INDIVIDUAL 등)
    private boolean approved;     // 승인 여부

    // Entity -> DTO 변환 메서드 (static factory method)
    public static ManagerProfileResponseDto from(ManagerProfileEntity entity) {
        if (entity == null) return new ManagerProfileResponseDto();

        return ManagerProfileResponseDto.builder()
                .username(entity.getUser().getUsername())
                .nickname(entity.getUser().getNickname())
                .managerName(entity.getManagerName())
                .companyName(entity.getCompanyName())
                .contactPhone(entity.getContact_phone())
                .businessNumber(entity.getBusinessNumber())
                .managerType(entity.getManagerType())
                .approved(entity.isApproved())
                .build();
    }

}