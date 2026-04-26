"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const id = searchParams.get("id");
        const email = searchParams.get("email");
        // 💡 한글 닉네임이 깨져서 넘어올 경우를 대비해 decodeURIComponent 사용
        const rawNickname = searchParams.get("nickname");
        const nickname = rawNickname ? decodeURIComponent(rawNickname) : "";

        if (id && email) {
            // 1. 로컬스토리지에 유저 정보 저장
            localStorage.setItem("userId", id);
            localStorage.setItem("email", email);
            localStorage.setItem("nickname", nickname);
            localStorage.setItem("role", "MEMBER");

            // 2. 💡 저장 완료 후 프로필 페이지로 이동 (유저 ID를 URL에 포함)
            // replace를 쓰면 뒤로가기 했을 때 다시 로그인 성공 페이지로 오지 않습니다.
            router.replace("/");
        } else {
            // 💡 만약 데이터가 부족하다면 에러 로그를 남기고 로그인 페이지로 리다이렉트
            console.error("로그인 정보가 누락되었습니다. id:", id, "email:", email);
            // router.replace("/login");
        }
    }, [searchParams, router]);

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-lg font-semibold text-slate-700">성공적으로 로그인되었습니다!</p>
            <p className="text-sm text-slate-500">잠시 후 메인 화면으로 이동합니다.</p>
        </div>
    );
}