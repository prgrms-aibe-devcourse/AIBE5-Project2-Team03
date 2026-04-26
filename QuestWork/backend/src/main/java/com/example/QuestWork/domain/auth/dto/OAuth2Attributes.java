package com.example.QuestWork.domain.auth.dto;

import com.example.QuestWork.domain.user.constant.AuthProvider;
import com.example.QuestWork.domain.user.constant.UserStatus;
import com.example.QuestWork.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;

@Getter
@Builder
public class OAuth2Attributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private String picture;
    private AuthProvider provider;
    private String providerId;

    public static OAuth2Attributes of(String registrationId, Map<String, Object> attributes) {
        if ("naver".equals(registrationId)) return ofNaver(attributes);
        if ("kakao".equals(registrationId)) return ofKakao(attributes);
        return ofGoogle(attributes);
    }

    private static OAuth2Attributes ofGoogle(Map<String, Object> attributes) {
        return OAuth2Attributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .provider(AuthProvider.GOOGLE)
                .providerId((String) attributes.get("sub"))
                .attributes(attributes)
                .nameAttributeKey("sub")
                .build();
    }

    private static OAuth2Attributes ofKakao(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        return OAuth2Attributes.builder()
                .name((String) profile.get("nickname"))
                .email((String) kakaoAccount.get("email"))
                .picture((String) profile.get("profile_image_url"))
                .provider(AuthProvider.KAKAO)
                .providerId(String.valueOf(attributes.get("id")))
                .attributes(attributes)
                .nameAttributeKey("id")
                .build();
    }

    private static OAuth2Attributes ofNaver(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return OAuth2Attributes.builder()
                .name((String) response.get("name"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .provider(AuthProvider.NAVER)
                .providerId((String) response.get("id"))
                .attributes(response)
                .nameAttributeKey("id")
                .build();
    }

    public User toEntity() {
        return User.builder()
                .username(email != null ? email : provider + "_" + providerId)
                .username(email) // 이메일을 로그인 ID로 사용
                .email(email)
                .nickname(name)
                .provider(provider)
                .provider_id(providerId)
                .status(UserStatus.ACTIVE) // 기본 활성 상태
                .roleIds(new HashSet<>(Collections.singletonList(8L))) // 예: 2번이 일반 회원 ROLE ID라면
                .build();
    }
}