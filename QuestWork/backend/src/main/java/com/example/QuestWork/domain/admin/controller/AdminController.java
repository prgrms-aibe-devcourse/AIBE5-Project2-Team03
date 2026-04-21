package com.example.QuestWork.domain.admin.controller;



import com.example.QuestWork.domain.admin.dto.AdminUserResponseDto;
import com.example.QuestWork.domain.admin.service.AdminService;
import com.example.QuestWork.domain.user.constant.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponseDto>> getUserList(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        // ?page=0&size=10 형식으로 요청을 받을 수 있습니다.
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    /**
     * 회원 상태 변경 (정지, 활성화, 탈퇴 등)
     * PATCH http://localhost:8000/api/admin/users/4/status
     */
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable("userId") Long userId,
            @RequestBody UserStatus status) { // JSON 값이 Enum으로 자동 매핑됨

        adminService.updateUserStatus(userId, status);

        return ResponseEntity.ok("유저(ID: " + userId + ")의 상태가 " + status + "로 변경되었습니다.");
    }
    @PatchMapping("/users/{userId}/role") // 1. 경로에 /users를 명시적으로 추가
    public ResponseEntity<String> updateUserRole(
            @PathVariable("userId") Long userId, // 2. PathVariable 이름을 명시
            @RequestBody java.util.Map<String, String> body) {

        String roleName = body.get("roleName");

        if (roleName == null || roleName.isEmpty()) {
            return ResponseEntity.badRequest().body("roleName 필드가 없습니다.");
        }

        // 3. 서비스 호출 (대문자로 변환해서 넘기면 DB 매칭 확률이 높아집니다)
        adminService.updateUserRole(userId, roleName.toUpperCase());

        return ResponseEntity.ok("유저[" + userId + "]의 권한이 " + roleName + "(으)로 변경되었습니다.");
    }
}