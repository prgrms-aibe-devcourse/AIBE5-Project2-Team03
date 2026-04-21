package com.example.QuestWork.domain.user.entity;

import com.example.QuestWork.domain.role.constant.RoleStatus;
import com.example.QuestWork.domain.user.constant.AuthProvider;
import com.example.QuestWork.domain.user.constant.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //big int

    @Column(nullable = false, length = 50)
    private String username; // varchar(50) NN

    @Column(length = 255)
    private String password; // varchar(255)

    @Column(nullable = false, length=100, unique = true)
    private String email;

    @Column(nullable = false, length=50)
    private String nickname;

    @Column(length=255)
    private String profile_image_url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length=20)
    private AuthProvider provider; // (local, kakao, naver, google)

    @Column(length=100)
    private String provider_id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @CreationTimestamp
    @Column(name= "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name= "updated_at", nullable = false, updatable = true)
    private LocalDateTime updatedAt;




    // @Setter는 제거하고 필요한 메서드만 직접 작성
    public void changeStatus(UserStatus status) {
        // 여기에 로직을 추가할 수도 있습니다.
        // 예: 이미 탈퇴한(DELETED) 유저는 정지(INACTIVE)할 수 없다 같은 검증 로직
        if (this.status == UserStatus.DELETED) {
            throw new RuntimeException("탈퇴한 회원은 상태를 변경할 수 없습니다.");
        }
        this.status = status;
    }
}

