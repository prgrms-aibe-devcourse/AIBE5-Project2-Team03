export const API_BASE_URL = "http://localhost:8000";

export async function apiFetch(
  url: string,
  options: RequestInit & { skipAuthRedirect?: boolean } = {},
) {
  const { skipAuthRedirect, ...fetchOptions } = options;
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include", // 💡 하드코딩으로 강제 설정 (401 에러 방지)
  });

  if (response.status === 401 && !skipAuthRedirect) {
    // 클라이언트 사이드에서만 동작하도록 체크
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // 로그인 페이지나 회원가입 페이지에서는 무한 리다이렉트를 방지하기 위해 이동하지 않음
      if (currentPath !== "/login" && currentPath !== "/signup") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}
