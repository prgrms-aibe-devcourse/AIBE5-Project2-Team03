"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Eye, EyeOff, Check, X, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 회원가입
export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    roleType: "MEMBER", // 💡 role -> roleType으로 변경 및 대문자 초기값
    managerName: "", // 👈 추가
    contactPhone: "", // 👈 추가
    managerType: "COMPANY",
  });
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailCodeSent(false);
      setEmailVerified(false);
      setEmailCode("");
    }
  };

  const sendVerificationCode = () => {
    // TODO: API call to send email verification code
    setEmailCodeSent(true);
  };

  const verifyCode = () => {
    // TODO: API call to verify email code
    if (emailCode.trim()) {
      setEmailVerified(true);
    }
  };

  const handleAllAgreements = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleAgreementChange = (
    key: keyof typeof agreements,
    checked: boolean,
  ) => {
    const newAgreements = { ...agreements, [key]: checked };
    newAgreements.all =
      newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  const passwordValidation = {
    length: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    formData.password === formData.passwordConfirm &&
    formData.passwordConfirm !== "";

  const trimmedFormData = {
    nickname: formData.nickname.trim(),
    email: formData.email.trim(),
    username: formData.username.trim(),
    roleType: formData.roleType.trim(), // 💡 role -> roleType
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedFormData.email);

  const isFormValid = Boolean(
    trimmedFormData.nickname &&
    trimmedFormData.email &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch &&
    trimmedFormData.username &&
    trimmedFormData.roleType && // 💡 role -> roleType
    agreements.terms &&
    agreements.privacy,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto p-0">
        <div className="p-6">
          <DialogHeader className="mb-6 text-center">
            <DialogTitle className="text-2xl font-bold text-foreground">
              회원가입
            </DialogTitle>
            <DialogDescription className="mt-2 text-foreground-muted">
              서비스 이용을 위해 회원가입을 진행해주세요
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                회원 유형
              </Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 transition ${
                    formData.roleType === "MEMBER"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-surface text-foreground hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="roleType" // 💡 name 속성 통일
                    value="MEMBER" // 💡 value 대문자 통일
                    checked={formData.roleType === "MEMBER"}
                    onChange={handleInputChange}
                    className="sr-only"
                    aria-label="일반 회원"
                  />
                  <User className="h-4 w-4" />
                  일반 회원
                </label>
                <label
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 transition ${
                    formData.roleType === "MANAGER"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-surface text-foreground hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="roleType" // 💡 name 속성 통일
                    value="MANAGER" // 💡 value 대문자 통일
                    checked={formData.roleType === "MANAGER"}
                    onChange={handleInputChange}
                    className="sr-only"
                    aria-label="기업 매니저"
                  />
                  <Building2 className="h-4 w-4" />
                  기업 매니저
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="modal-nickname"
                className="text-sm font-medium text-foreground"
              >
                닉네임 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="modal-nickname"
                name="nickname"
                type="text"
                required
                placeholder={
                  formData.roleType === "MANAGER"
                    ? "회사명을 입력해주세요"
                    : "닉네임을 입력하세요"
                }
                value={formData.nickname}
                onChange={handleInputChange}
                className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="modal-email"
                className="text-sm font-medium text-foreground"
              >
                이메일 <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="modal-email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={emailVerified}
                  className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
                />
                <Button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={!formData.email || emailVerified}
                  className="h-11 shrink-0 bg-primary text-sm text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
                >
                  {emailVerified ? "인증완료" : "코드 발송"}
                </Button>
              </div>
              {emailCodeSent && !emailVerified && (
                <div className="flex gap-2">
                  <Input
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="인증 코드를 입력하세요"
                    className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
                  />
                  <Button
                    type="button"
                    onClick={verifyCode}
                    className="h-11 shrink-0 bg-primary text-sm text-primary-foreground hover:bg-primary-hover"
                  >
                    확인
                  </Button>
                </div>
              )}
              {emailVerified && (
                <p className="flex items-center gap-1 text-sm text-success">
                  <Check className="h-4 w-4" /> 이메일이 인증되었습니다
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="modal-password"
                className="text-sm font-medium text-foreground"
              >
                비밀번호 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="modal-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-11 border-border bg-surface pr-12 focus:border-primary focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <PasswordRule
                    valid={passwordValidation.length}
                    text="8자 이상"
                  />
                  <PasswordRule
                    valid={passwordValidation.hasLetter}
                    text="영문 포함"
                  />
                  <PasswordRule
                    valid={passwordValidation.hasNumber}
                    text="숫자 포함"
                  />
                  <PasswordRule
                    valid={passwordValidation.hasSpecial}
                    text="특수문자 포함"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="modal-passwordConfirm"
                className="text-sm font-medium text-foreground"
              >
                비밀번호 확인 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="modal-passwordConfirm"
                  name="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  required
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="h-11 border-border bg-surface pr-12 focus:border-primary focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground"
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.passwordConfirm && (
                <p
                  className={`flex items-center gap-1 text-sm ${passwordsMatch ? "text-success" : "text-destructive"}`}
                >
                  {passwordsMatch ? (
                    <>
                      <Check className="h-4 w-4" /> 비밀번호가 일치합니다
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" /> 비밀번호가 일치하지 않습니다
                    </>
                  )}
                </p>
              )}
            </div>

            {/* 기존 이름/담당자 이름 입력란 */}
            <div className="space-y-2">
              <Label
                htmlFor="modal-username"
                className="text-sm font-medium text-foreground"
              >
                {formData.roleType === "MANAGER" ? "아이디(성함)" : "이름"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="modal-username"
                name="username"
                type="text"
                required
                placeholder={
                  formData.roleType === "MANAGER"
                    ? "사용하실 아이디를 입력하세요"
                    : "이름을 입력하세요"
                }
                value={formData.username}
                onChange={handleInputChange}
                className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
              />
            </div>

            {/* 💡 매니저일 때만 나타나는 추가 필드 (담당자명 & 연락처) */}
            {formData.roleType === "MANAGER" && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="modal-managerName"
                    className="text-sm font-medium text-foreground"
                  >
                    담당자 실명 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="modal-managerName"
                    name="managerName" // 👈 formData.managerName과 매핑
                    type="text"
                    required
                    placeholder="담당자 성함을 입력하세요"
                    value={formData.managerName || ""}
                    onChange={handleInputChange}
                    className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="modal-contactPhone"
                    className="text-sm font-medium text-foreground"
                  >
                    담당자 연락처 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="modal-contactPhone"
                    name="contactPhone" // 👈 formData.contactPhone과 매핑
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={formData.contactPhone || ""}
                    onChange={handleInputChange}
                    className="h-11 border-border bg-surface focus:border-primary focus:ring-primary"
                  />
                </div>
              </>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 rounded-lg bg-surface p-3">
                <Checkbox
                  id="modal-all"
                  checked={agreements.all}
                  onCheckedChange={(checked) =>
                    handleAllAgreements(checked === true)
                  }
                />
                <Label
                  htmlFor="modal-all"
                  className="cursor-pointer text-sm font-medium text-foreground"
                >
                  전체 동의
                </Label>
              </div>

              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="modal-terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) =>
                      handleAgreementChange("terms", checked === true)
                    }
                  />
                  <Label
                    htmlFor="modal-terms"
                    className="cursor-pointer text-sm text-foreground-muted"
                  >
                    (필수) 이용약관 동의
                  </Label>
                  <button
                    type="button"
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    보기
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="modal-privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) =>
                      handleAgreementChange("privacy", checked === true)
                    }
                  />
                  <Label
                    htmlFor="modal-privacy"
                    className="cursor-pointer text-sm text-foreground-muted"
                  >
                    (필수) 개인정보 수집 및 이용 동의
                  </Label>
                  <button
                    type="button"
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    보기
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="modal-marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) =>
                      handleAgreementChange("marketing", checked === true)
                    }
                  />
                  <Label
                    htmlFor="modal-marketing"
                    className="cursor-pointer text-sm text-foreground-muted"
                  >
                    (선택) 마케팅 정보 수신 동의
                  </Label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid}
              className="h-11 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              가입하기
            </Button>
          </form>

          {/* ... 나머지 하단 소셜 로그인 부분 동일 ... */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-foreground-muted">
                간편 가입
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg font-medium shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#191600" }}
            >
              <KakaoIcon />
              <span>카카오로 시작하기</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg font-medium text-white shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#03C75A" }}
            >
              <NaverIcon />
              <span>네이버로 시작하기</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-white text-gray-700 shadow-sm transition-all hover:bg-surface"
            >
              <GoogleIcon />
              <span>Google로 시작하기</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ... PasswordRule, KakaoIcon, NaverIcon, GoogleIcon 컴포넌트 동일 ...
function PasswordRule({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-xs ${valid ? "text-success" : "text-foreground-muted"}`}
    >
      {valid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.674 1.736 5.023 4.355 6.356-.13.47-.84 3.03-.867 3.223 0 0-.017.141.075.196.092.055.2.025.2.025.265-.037 3.067-2.01 3.553-2.35.888.126 1.805.192 2.684.192 5.523 0 10-3.463 10-7.643C22 6.463 17.523 3 12 3z" />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
