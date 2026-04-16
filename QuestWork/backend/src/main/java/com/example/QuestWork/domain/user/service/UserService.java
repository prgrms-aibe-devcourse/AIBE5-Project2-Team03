package com.example.QuestWork.domain.user.service;

import com.example.QuestWork.domain.user.constant.AuthProvider;
import com.example.QuestWork.domain.user.constant.UserStatus;
import com.example.QuestWork.domain.user.dto.UserLoginRequestDto;
import com.example.QuestWork.domain.user.dto.UserSignupRequesetDto;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly=true)
    public String login(UserLoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다"));
        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다"); }
        return user.getNickname();
    }

    @Transactional
    public Long signup(UserSignupRequesetDto dto) {
        if(userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일 입니다");
        }

        //Dto -> Entity 변환
        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                .provider(AuthProvider.LOCAL) // 일반가입
                .status(UserStatus.ACTIVE)
//                .createdAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user).getId();
        }

    }


