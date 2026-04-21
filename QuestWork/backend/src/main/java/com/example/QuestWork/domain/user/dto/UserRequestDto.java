package com.example.QuestWork.domain.user.dto;

import com.example.QuestWork.domain.user.constant.AuthProvider;
import com.example.QuestWork.domain.user.constant.UserStatus;
import com.example.QuestWork.domain.user.entity.User; // 본인의 엔티티로 수정
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String username;
    private String password;
    private String email;
    private String nickname;
    private String roleType; // "MEMBER" or "MANAGER"

    // 💡 매니저 추가 정보 필드 삽입
    private String managerType;
    private String companyName;
    private String businessNumber;
    private String managerName;   // 👈 추가
    private String contactPhone;  // 👈 추가 (DB 컬럼명 contact_phone과 매핑)

    public User toUserEntity(String encodedPassword) {
        return User.builder()
                .username(this.username)
                .password(encodedPassword)
                .email(this.email)
                .nickname(this.nickname)
                .status(UserStatus.ACTIVE)    // 기본 상태
                .provider(AuthProvider.LOCAL) // 💡 아까 발생한 에러 해결 포인트!
                .build();
    }
}