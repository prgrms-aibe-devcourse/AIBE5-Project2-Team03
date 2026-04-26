package com.example.QuestWork.global;

import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor // 💡 1. 이걸 꼭 붙여야 생성자 주입이 됩니다!
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = null;

        // 1. 카카오 방식 추출
        if (attributes.get("kakao_account") != null) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakaoAccount.get("email");
        }
        // 2. 네이버 방식 추출
        else if (attributes.get("response") != null) {
            Map<String, Object> resp = (Map<String, Object>) attributes.get("response");
            email = (String) resp.get("email");
        }
        // 3. 기타 (구글 등 기본 방식)
        else {
            email = (String) attributes.get("email");
        }

        // [중요] 이메일이 잘 뽑혔는지 로그로 확인해보세요!
        System.out.println("추출된 이메일: " + email);

        // DB 조회 (이제 email이 정확하니 잘 찾을 겁니다)
        String finalEmail = email;
        User user = userRepository.findByEmail(finalEmail)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 추출된 이메일: " + finalEmail));

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login-success")
                .queryParam("id", user.getId())
                .queryParam("email", finalEmail)
                .queryParam("nickname", user.getNickname())
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}