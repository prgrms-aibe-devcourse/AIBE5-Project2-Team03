package com.example.QuestWork.domain.user.service;

import com.example.QuestWork.domain.auth.dto.OAuth2Attributes;
import com.example.QuestWork.domain.member.constant.MemberLevel;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity; // 패키지 경로 확인!
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final MemberProfileRepository memberProfileRepository; // 💡 추가!
    private final WalletRepository walletRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Attributes attributes = OAuth2Attributes.of(registrationId, oAuth2User.getAttributes());

        User user = saveOrUpdate(attributes);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes.getAttributes(),
                attributes.getNameAttributeKey()
        );
    }

    private User saveOrUpdate(OAuth2Attributes attributes) {
        // 1. 유저 정보 저장/업데이트
        User user = userRepository.findByEmail(attributes.getEmail())
                .map(entity -> {
                    entity.setNickname(attributes.getName());
                    return entity;
                })
                .orElseGet(attributes::toEntity);

        User savedUser = userRepository.save(user);

        // 2. 💡 [중요] 저장된 유저의 프로필이 존재하는지 확인 후 없으면 생성
        // existsByUserId가 리포지토리에 없다면 findByUserId(savedUser.getId()).isEmpty() 등으로 대체 가능
        if (!memberProfileRepository.findByUserId(savedUser.getId()).isPresent()) {
            MemberProfileEntity newProfile = MemberProfileEntity.builder()
                    .user(savedUser)
                    .level(MemberLevel.BRONZE)
                    .intro("소셜 로그인을 통해 가입된 유저입니다.")
                    .badgeCount(0)
                    .totalReward(BigDecimal.ZERO)
                    .build();

            memberProfileRepository.save(newProfile);
        }
        // ⭐ [핵심 추가] 이 유저의 지갑이 없으면 새로 생성해준다!
        WalletEntity wallet = WalletEntity.builder()
                .userId(savedUser.getId()) // 💡 .memberProfile이 아니라 .memberId입니다!
                .balance(BigDecimal.ZERO)
                .build();
        walletRepository.save(wallet);


        return savedUser;
    }
}