-- =====================================================
-- Admin 통계/정산 테스트 데이터 시드
-- =====================================================
-- 유저 매핑:
--   member_profiles.id: 3=유상진(user5), 4=삼성(user6), 5=한경수(user1), 6=이석민2(user8)
--   manager_profiles.id: 1=삼성(user6)
--   wallet.id:           1=한경수, 2=이석민, 3=유상진, 4=삼성, 5=이석민2
-- =====================================================

-- 2. payments (수수료 수익 통계용)
--    amount: 원금, fee: 10% 수수료, net_amount: 개발자 수령액
--    paid_at 오늘 포함 최근 7일 분산 → todayFeeRevenue + availableBalance 집계
INSERT INTO payments (member_id, quest_id, amount, fee, net_amount, status, paid_at, created_at) VALUES
(5, 7,  1000000.00, 100000.00,  900000.00, 'COMPLETED', CURDATE(),                            NOW()),
(3, 8,  2000000.00, 200000.00, 1800000.00, 'COMPLETED', CURDATE(),                            NOW()),
(6, 9,   800000.00,  80000.00,  720000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 1 DAY),  NOW()),
(4, 10, 2500000.00, 250000.00, 2250000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 2 DAY),  NOW()),
(3, 11, 1200000.00, 120000.00, 1080000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 2 DAY),  NOW()),
(6, 12,  900000.00,  90000.00,  810000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 3 DAY),  NOW()),
(5, 13, 2000000.00, 200000.00, 1800000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 4 DAY),  NOW()),
(3, 14, 1100000.00, 110000.00,  990000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 5 DAY),  NOW()),
(6, 15, 1300000.00, 130000.00, 1170000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 6 DAY),  NOW()),
(5, 16, 1800000.00, 180000.00, 1620000.00, 'COMPLETED', DATE_SUB(CURDATE(), INTERVAL 6 DAY),  NOW());

-- 3. escrows (에스크로 현황 - LOCKED + RELEASED)
--    LOCKED  → totalLockedEscrow 집계
--    RELEASED → dailyRevenues 차트 집계 (escrow.released_at 기준)
INSERT INTO escrows (quest_id, manager_id, amount, status, deposited_at, released_at) VALUES
-- LOCKED (현재 예치 중)
(7,  1, 1000000.00, 'LOCKED',   DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
(8,  1, 2000000.00, 'LOCKED',   DATE_SUB(NOW(), INTERVAL  8 DAY), NULL),
(9,  1,  800000.00, 'LOCKED',   DATE_SUB(NOW(), INTERVAL  7 DAY), NULL),
(10, 1, 2500000.00, 'LOCKED',   DATE_SUB(NOW(), INTERVAL  5 DAY), NULL),
(11, 1, 1200000.00, 'LOCKED',   DATE_SUB(NOW(), INTERVAL  3 DAY), NULL),
-- RELEASED (지급 완료 - 최근 7일 차트 데이터)
(12, 1,  900000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(13, 1, 2000000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(14, 1, 1100000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(15, 1, 1300000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(16, 1, 1800000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(17, 1, 1100000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(18, 1,  850000.00, 'RELEASED', DATE_SUB(NOW(), INTERVAL 32 DAY), NOW());

-- 4. withdraw_requests (출금 신청 - 정산관리 페이지 출금 신청 목록)
--    REQUESTED → pendingWithdrawalCount 집계
INSERT INTO withdraw_requests (member_id, amount, bank_name, account_number, account_holder, status, requested_at) VALUES
(3,  500000.00, '국민은행',  '1234-56-7890123',  '유상진',  'REQUESTED', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6,  800000.00, '신한은행',  '110-123-456789',   '이석민2', 'REQUESTED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4,  300000.00, '카카오뱅크','3333-01-1234567',  '삼성',    'REQUESTED', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 1000000.00, '우리은행',  '1002-123-456789',  '한경수',  'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3,  600000.00, '하나은행',  '123-456789-01011', '유상진',  'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(6,  200000.00, '토스뱅크',  '100-0123-4567',    '이석민2', 'REJECTED',  DATE_SUB(NOW(), INTERVAL 5 DAY));

-- 5. wallet_transaction (지갑 트랜잭션 - 정산관리 지갑 탭)
--    wallet_id: wallet 테이블 id (1=한경수, 2=이석민, 3=유상진, 4=삼성, 5=이석민2)
INSERT INTO wallet_transaction (wallet_id, user_id, amount, type, status, reference_id, description, created_at) VALUES
-- SETTLEMENT
(3, 5,  900000.00, 'SETTLEMENT', 'COMPLETED',  7, '퀘스트 #7 React Admin Dashboard 정산',   DATE_SUB(NOW(), INTERVAL 1  DAY)),
(3, 5, 1800000.00, 'SETTLEMENT', 'COMPLETED',  8, '퀘스트 #8 Spring Boot API 정산',          DATE_SUB(NOW(), INTERVAL 2  DAY)),
(5, 8,  720000.00, 'SETTLEMENT', 'COMPLETED',  9, '퀘스트 #9 React Native 앱 정산',          DATE_SUB(NOW(), INTERVAL 3  DAY)),
(4, 6, 2250000.00, 'SETTLEMENT', 'COMPLETED', 10, '퀘스트 #10 Next.js 이커머스 정산',        DATE_SUB(NOW(), INTERVAL 4  DAY)),
(3, 5, 1080000.00, 'SETTLEMENT', 'COMPLETED', 11, '퀘스트 #11 Python FastAPI 정산',           DATE_SUB(NOW(), INTERVAL 5  DAY)),
(5, 8,  810000.00, 'SETTLEMENT', 'COMPLETED', 12, '퀘스트 #12 Vue.js 대시보드 정산',         DATE_SUB(NOW(), INTERVAL 6  DAY)),
(1, 1, 1800000.00, 'SETTLEMENT', 'COMPLETED', 13, '퀘스트 #13 Kubernetes CI/CD 정산',        DATE_SUB(NOW(), INTERVAL 7  DAY)),
-- WITHDRAW
(3, 5,  500000.00, 'WITHDRAW',   'PENDING',   1,  '국민은행 출금 신청',                       DATE_SUB(NOW(), INTERVAL 1  DAY)),
(5, 8,  800000.00, 'WITHDRAW',   'PENDING',   2,  '신한은행 출금 신청',                       DATE_SUB(NOW(), INTERVAL 2  DAY)),
(1, 1, 1000000.00, 'WITHDRAW',   'COMPLETED', 4,  '우리은행 출금 완료',                       DATE_SUB(NOW(), INTERVAL 7  DAY));

