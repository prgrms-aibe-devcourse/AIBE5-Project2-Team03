# 🚀 QuestWork

> **기존의 프리랜서 플랫폼이 단순히 '사람과 사람을 연결'하는 것에 그쳤다면, QuestWork는 그 이후의 과업 수행과 신뢰할 수 있는 보상에 집중합니다.**

**우리는 게임의 '퀘스트' 구조를 비즈니스에 이식하여, 발주자에게는 효율적인 프로젝트 관리를, 수행자에게는 명확한 보상 체계를 제공합니다. 특히 에스크로(Escrow) 기반의 자동 정산 시스템을 통해 거래의 완결성을 확보하고 서비스 신뢰도를 극대화했습니다.**

---

### 🛠 Tech Stack & Auth

| Category | Tech Stack |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2.12, Spring Security, JPA |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Database** | MySQL |
| **Social Auth** | Google, Kakao, Naver |
| **IDE & Editors** | IntelliJ IDEA, VS Code, Cursor |
| **Design & Docs** | Figma, Notion, Google Docs |
| **AI Assistance** | ChatGPT, Google Gemini, Codex, v0 |

---

### ✨ Key Features

* 🎯 **퀘스트 관리 시스템**: 매니저의 과업 등록부터 수행자의 결과물 제출 및 검수까지 이어지는 엔드투엔드 태스크 워크플로우 구현
* 🔒 **에스크로 기반 자동 정산**: 거래 신뢰성 확보를 위한 대금 예치 시스템 및 우승자 선정 시 Point 자동 트랜잭션 처리
* 🔑 **RBAC 기반 권한 제어**: Spring Security를 활용하여 Admin(운영), Manager(발주), Member(수행) 간의 정교한 접근 권한 분리
* ☁️ **OAuth 2.0 소셜 인증**: Google, Kakao, Naver API 연동을 통한 사용자 접근성 극대화 및 보안성 높은 통합 인증 제공

---

### 📂 Directory Structure

```text
frontend/
├── app/                          # 페이지 라우팅 (Next.js App Router)
│   ├── layout.tsx / page.tsx     # 루트 레이아웃 & 메인 랜딩
│   ├── admin/                    # 관리자 대시보드 (통계/정산 관리)
│   ├── dashboard/                # 멤버 워크스페이스 (참여 퀘스트/수익)
│   ├── manager/                  # 매니저 워크스페이스 (퀘스트 등록/검수)
│   ├── quests/                   # 퀘스트 목록 및 상세 페이지
│   ├── blog/ / profile/          # 기술 블로그 및 유저 프로필
│   └── login/ / signup/          # 인증 페이지
├── components/                   # 재사용 UI 컴포넌트 (shadcn/ui 기반)
├── lib/                          # API 클라이언트 및 유틸리티
├── hooks/                        # 커스텀 훅 (비즈니스 로직 분리)
└── public/                       # 정적 리소스 (Images, Videos)

backend/src/main/java/com/example/QuestWork/
├── domain/                       # 도메인별 비즈니스 로직
│   ├── admin/                    # 플랫폼 전체 통계 및 관리자 기능
│   ├── quest/                    # 퀘스트 등록, 조회, 상태 관리 핵심 도메인
│   ├── user/                     # 기본 사용자 계정 관리
│   ├── member/                   # 프리랜서(수행자) 프로필 및 레벨
│   ├── manager/                  # 발주자 프로필 및 관리
│   ├── payment/                  # 결제 영수증 및 상태(PAID) 관리
│   ├── wallet/                   # 유저 지갑 및 정산 트랜잭션 처리
│   ├── escrows/                  # 대금 예치 관리
│   ├── withdraw/                 # 출금 신청 프로세스
│   ├── auth/                     # OAuth2 & JWT 인증 로직
│   └── role/                     # RBAC 권한(MEMBER, MANAGER, ADMIN)
├── global/                       # 공통 설정 (Security, Config, Error Handler)
└── resources/                    # application.properties 및 DB 설정
```

---

### 🔑 Core API Specifications

| Category | API Endpoint & Description |
| :--- | :--- |
| **Auth & User** | `POST /api/auth/signup` - 일반 및 소셜 회원가입 |
| | `GET /api/user/{id}` - 유저 프로필 및 활동 정보 조회 |
| | `POST /api/upload` - 파일 및 과업 결과물 업로드 |
| **Quest Management** | `POST /api/quests` - 퀘스트 등록 및 에스크로 예치 |
| | `GET /api/quests` - 전체 퀘스트 목록 및 필터링 조회 |
| | `PATCH /api/quests/{id}/status` - 퀘스트 상태 변경 관리 |
| **Work & Settlement** | `POST /api/quests/{id}/submissions` - 과업 결과물 제출 |
| | **`POST /api/manager/quests/{id}/winner`** - **우승자 선정 및 정산(PAID) 실행** |
| **Wallet & Finance** | `GET /api/settlement/wallet/{userId}` - 실시간 잔액 및 포인트 확인 |
| | `POST /api/settlement/withdraw` - 정산 포인트 출금 신청 |
| | `GET /api/settlement/transactions/{id}` - 상세 거래 내역 히스토리 |
| **Admin System** | `GET /api/admin/stats/summary` - 플랫폼 매출 및 통계 요약 |
| | `POST /api/admin/settle` - 플랫폼 수수료 최종 정산 처리 |
| | `PATCH /api/admin/users/{id}/role` - 사용자 권한 및 상태 관리 |

---

### 🖼️ Database Entire ERD

![ERD](./images/diagram.png)

---

### 🛡️ Technical Challenges & Solutions

#### 1. 정산 시스템의 데이터 무결성 보장
- **문제**: 정산 프로세스 중 결제 테이블(PAID) 업데이트와 지갑 잔액(Wallet) 추가가 별개로 일어날 경우, 시스템 오류 시 데이터 불일치 대참사 발생 가능성.
- **해결**: Spring의 `@Transactional`을 활용하여 **원자성(Atomicity)** 확보. 모든 정산 과정이 하나의 트랜잭션 내에서 처리되도록 설계하여 실패 시 전체 롤백 처리.
- **학습 포인트**: Spring AOP 프록시 구조상 `private` 메서드에서는 `@Transactional`이 동작하지 않는 이슈를 파악하고, 서비스 레이어의 호출 구조를 개선하여 해결함.

#### 2. 확장성을 고려한 도메인 기반 패키지 구조
- **문제**: 기능이 추가됨에 따라 Controller와 Service가 비대해져 유지보수가 어려워짐.
- **해결**: 레이어드 아키텍처를 기반으로 하되, **도메인 단위(Quest, Wallet, Admin 등)**로 패키지를 분리하여 협업 효율성과 코드 가독성을 극대화함.

---

