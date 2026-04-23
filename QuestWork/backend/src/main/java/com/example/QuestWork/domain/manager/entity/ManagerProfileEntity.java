package com.example.QuestWork.domain.manager.entity;

import com.example.QuestWork.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manager_profiles")
@Getter
@Setter // 💡 setUser 및 필드 수정을 위해 추가
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용
@AllArgsConstructor
@Builder
public class ManagerProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default // 💡 빌더 사용 시 기본값 보존
    @Column(name = "manager_type", nullable = false, length = 20)
    private String managerType = "INDIVIDUAL"; // 기본값 설정

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "business_number", length = 50)
    private String businessNumber;

    @Column(name = "manager_name", length = 50)
    private String managerName;

    @Column(name = "contact_phone", length = 30)
    private String contact_phone;

    @Builder.Default
    @Column(nullable = false)
    private boolean approved = false;

    // 연관관계 편의 메서드 (Optional: 안전한 설정을 위해)
    public void setUser(User user) {
        this.user = user;
    }

    public void updateManagerInfo(String managerName, String companyName, String contactPhone, String businessNumber) {
        if (managerName != null && !managerName.trim().isEmpty()) {
            this.managerName = managerName;
        }
        if (companyName != null && !companyName.trim().isEmpty()) {
            this.companyName = companyName;
        }
        if (contactPhone != null && !contactPhone.trim().isEmpty()) {
            this.contact_phone = contactPhone;
        }
        if (businessNumber != null && !businessNumber.trim().isEmpty()) {
            this.businessNumber = businessNumber;
        }
    }
}