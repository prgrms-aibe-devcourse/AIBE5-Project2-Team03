package com.example.QuestWork.domain.user.controller;

import com.example.QuestWork.domain.user.dto.UserLoginRequestDto;
import com.example.QuestWork.domain.user.dto.UserRequestDto;
import com.example.QuestWork.domain.user.dto.UserResponseDto;
import com.example.QuestWork.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    // 실제 입력이 들어오는 주소(3000:/api/auth/signup)
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserRequestDto dto) {
        // 1. @RequestBody 파라미터 이름을 dto로 맞추거나,
        // 2. 아래 호출부의 이름을 dto로 일치시켜야 합니다.

        userService.signUp(dto);

        return ResponseEntity.ok("회원 가입 성공");
    }


}
