"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// --- 기존 타입 및 유틸리티 함수 (중략 없이 포함) ---
export type WithdrawalStatus = "PENDING" | "COMPLETED" | "REJECTED"

export interface WithdrawalRequest {
  id: string
  userId: string
  bankName: string
  accountNumber: string
  amount: string
  requestedAt: string
  status: WithdrawalStatus
  rejectReason?: string
}

export interface SettlementRecord {
  id: string
  userId: string
  questId: string
  principal: string
  fee?: string
  netAmount?: string
  completedAt: string
}

export type WalletTransactionRecord = {
  id: string
  userId: string
  amount: string
  originalAmount: string
  fee: string
  type: 'SETTLEMENT' | 'WITHDRAW'
  status: string
  referenceId: string
  description: string
  createdAt: string
}

const formatAmount = (value: string) => {
  const normalized = String(value ?? "").replace(/,/g, "").trim()
  if (!normalized) return "-"
  const [integer, fraction] = normalized.split(".")
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return fraction ? `${formattedInteger}.${fraction}` : formattedInteger
}

const getStatusBadgeStyle = (status: WithdrawalStatus) => {
  switch (status) {
    case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200"
    case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "REJECTED": return "bg-rose-50 text-rose-700 border-rose-200"
    default: return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getStatusLabel = (status: WithdrawalStatus) => {
  switch (status) {
    case "PENDING": return "대기 중"
    case "COMPLETED": return "승인 완료"
    case "REJECTED": return "반려됨"
    default: return status
  }
}

const divideByTen = (value: string) => {
  const normalized = String(value ?? "").replace(/,/g, "").trim()
  if (!normalized) return "0"
  const [intPart = "0", decPart = ""] = normalized.split(".")
  if (intPart.length <= 1) return `0.${intPart}${decPart}`.replace(/\.?(0+)$/, "")
  const newInteger = intPart.slice(0, -1)
  const newDecimal = `${intPart.slice(-1)}${decPart}`
  return `${newInteger}.${newDecimal}`.replace(/\.?(0+)$/, "")
}

const subtractDecimalStrings = (a: string, b: string) => {
  const normalize = (value: string) => {
    const cleaned = String(value ?? "").replace(/,/g, "").trim()
    const [intPart = "0", decPart = ""] = cleaned.split(".")
    return { intPart, decPart }
  }
  const aParts = normalize(a), bParts = normalize(b)
  const scale = Math.max(aParts.decPart.length, bParts.decPart.length)
  const aNum = Number(`${aParts.intPart}.${aParts.decPart.padEnd(scale, "0")}`)
  const bNum = Number(`${bParts.intPart}.${bParts.decPart.padEnd(scale, "0")}`)
  const diff = aNum - bNum
  return diff.toString()
}

// --- 테이블 컴포넌트들 ---

export function WithdrawalTable({ withdrawals = [], onApprove, onReject }: any) {
  // --- 상태 관리 ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [filterUserId, setFilterUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleRejectClick = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedId && rejectReason.trim()) {
      onReject(selectedId, rejectReason);
      setDialogOpen(false);
      setRejectReason("");
    } else {
      alert("반려 사유를 입력해주세요.");
    }
  };

  // --- 필터링 로직 (수정된 부분) ---
  const filteredWithdrawals = withdrawals.filter((w: any) => {
    // 💡 includes 대신 === 를 사용하여 ID가 정확히 일치할 때만 검색되도록 수정
    const matchId = !filterUserId || String(w.userId) === filterUserId;

    // 상태 필터
    const matchStatus = filterStatus === "ALL" || w.status === filterStatus;

    // 금액 범위 필터
    const amount = Number(String(w.amount).replace(/,/g, ""));
    const matchMin = !minAmount || amount >= Number(minAmount);
    const matchMax = !maxAmount || amount <= Number(maxAmount);

    return matchId && matchStatus && matchMin && matchMax;
  });

  return (
      <div className="space-y-4">
        {/* 🔍 필터 UI 섹션 (한글화 완료) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase">유저 ID</label>
            <input
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="ID를 입력하세요."
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase">처리 상태</label>
            <select
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">전체 상태</option>
              <option value="REQUESTED">대기 중</option>
              <option value="COMPLETED">승인 완료</option>
              <option value="REJECTED">반려됨</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase">신청 금액 범위</label>
            <div className="flex items-center gap-2">
              <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none"
                  placeholder="최소 금액"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
              />
              <span className="text-slate-300">~</span>
              <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none"
                  placeholder="최대 금액"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
              />
              <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-600 font-normal"
                  onClick={() => { setFilterUserId(""); setFilterStatus("ALL"); setMinAmount(""); setMaxAmount(""); }}
              >
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 📊 테이블 섹션 */}
        <Card className="border-0 shadow-lg rounded-xl bg-white overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-0">
                <TableHead className="w-[10%] text-center h-16 align-middle text-slate-500 font-medium text-xs">유저 ID</TableHead>
                <TableHead className="w-[14%] text-center h-16 align-middle text-slate-500 font-medium text-xs">은행</TableHead>
                <TableHead className="w-[18%] text-center h-16 align-middle text-slate-500 font-medium text-xs">계좌번호</TableHead>
                <TableHead className="w-[16%] text-right h-16 align-middle pr-10 text-slate-500 font-medium text-xs">신청 금액</TableHead>
                <TableHead className="w-[22%] text-center h-16 align-middle text-slate-500 font-medium text-xs">신청 일시</TableHead>
                <TableHead className="w-[15%] text-center h-16 align-middle text-slate-500 font-medium text-xs">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.map((w: any) => (
                  <TableRow key={w.id} className="hover:bg-slate-50/50 border-0 transition-colors align-middle">
                    <TableCell className="py-4 align-middle text-center text-sm">{w.userId}</TableCell>
                    <TableCell className="py-4 align-middle text-center text-sm">{w.bankName}</TableCell>
                    <TableCell className="py-4 font-mono text-xs align-middle text-center text-slate-500">{w.accountNumber}</TableCell>
                    <TableCell className="py-4 font-semibold text-slate-900 text-right align-middle pr-10">{formatAmount(w.amount)}원</TableCell>
                    <TableCell className="py-4 text-slate-500 text-xs align-middle text-center">{w.requestedAt}</TableCell>
                    <TableCell className="py-4 align-middle text-center">
                      <div className="inline-flex justify-center items-center">
                        {w.status !== "REQUESTED" ? (
                            <Badge className={`${getStatusBadgeStyle(w.status)} border-0 px-3 py-1 text-xs font-medium rounded-full`}>
                              {getStatusLabel(w.status)}
                            </Badge>
                        ) : (
                            <div className="flex gap-2">
                              <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 rounded-lg text-xs"
                                  onClick={() => onApprove(w.id)}
                              >
                                승인
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-3 rounded-lg text-xs"
                                  onClick={() => handleRejectClick(w.id)}
                              >
                                반려
                              </Button>
                            </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredWithdrawals.length === 0 && (
              <div className="py-20 text-center text-slate-400 text-sm bg-white">
                일치하는 출금 신청 내역이 없습니다.
              </div>
          )}

          {/* 반려 다이얼로그 */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>출금 요청 반려</AlertDialogTitle>
                <AlertDialogDescription>
                  반려 사유를 입력해주세요. 유저에게 해당 사유가 전달됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
              <textarea
                  className="w-full min-h-[100px] p-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="예: 계좌정보 불일치, 본인 확인 불가 등"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
              />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRejectReason("")}>취소</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-rose-600 hover:bg-rose-700"
                    onClick={confirmReject}
                >
                  반려 확정
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
  );
}

export function SettlementHistoryTable({ transactions, showSettlementColumns }: { transactions: WalletTransactionRecord[], showSettlementColumns: boolean }) {
  const [filterType, setFilterType] = useState<string>("");
  const [filterUserId, setFilterUserId] = useState<string>("");
  const [filterSettlementUserId, setFilterSettlementUserId] = useState<string>("");
  const [filterQuestId, setFilterQuestId] = useState<string>("");

  // 지갑 입출금 로그 필터
  const filteredTransactions = transactions.filter((tx) => {
    const typeMatch = !filterType || tx.type === filterType;
    const userIdMatch = !filterUserId || tx.userId === filterUserId;
    return typeMatch && userIdMatch;
  });

  // 퀘스트 정산 이력 필터
  const filteredSettlements = transactions.filter((tx) => {
    const userIdMatch = !filterSettlementUserId || tx.userId === filterSettlementUserId;
    const questIdMatch = !filterQuestId || tx.referenceId === filterQuestId;
    return userIdMatch && questIdMatch;
  });

  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-lg rounded-xl bg-white p-6">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-slate-600">트랜잭션 이력이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  if (showSettlementColumns) {
    // 퀘스트 정산 이력: [유저 ID, 퀘스트 ID, 원금, 수수료, 실지급액, 정산일시]
    return (
      <div className="space-y-4">
        {/* 필터 UI */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-600 mb-2 block">유저 ID</label>
            <input
              type="text"
              placeholder="유저 ID 입력"
              value={filterSettlementUserId}
              onChange={(e) => setFilterSettlementUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-600 mb-2 block">퀘스트 ID</label>
            <input
              type="text"
              placeholder="퀘스트 ID 입력"
              value={filterQuestId}
              onChange={(e) => setFilterQuestId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => {
              setFilterSettlementUserId("");
              setFilterQuestId("");
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-sm transition"
          >
            초기화
          </button>
        </div>

        {/* 필터 결과 표시 */}
        {filteredSettlements.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-xl bg-white p-6">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-slate-600">필터에 일치하는 데이터가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-xl bg-white overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-0">
                  <TableHead className="w-[10%] text-center h-16 align-middle text-slate-500 font-medium text-xs">유저 ID</TableHead>
                  <TableHead className="w-[10%] text-center h-16 align-middle text-slate-500 font-medium text-xs">퀘스트 ID</TableHead>
                  <TableHead className="w-[20%] text-right h-16 align-middle pr-10 text-slate-500 font-medium text-xs">원금</TableHead>
                  <TableHead className="w-[20%] text-right h-16 align-middle pr-10 text-slate-500 font-medium text-xs">수수료(10%)</TableHead>
                  <TableHead className="w-[20%] text-right h-16 align-middle pr-10 text-slate-500 font-medium text-xs">실지급액</TableHead>
                  <TableHead className="w-[30%] text-center h-16 align-middle text-slate-500 font-medium text-xs">정산일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettlements.map((record) => {
              // 1. 실제 DB에서 넘어온 입금액 (9000원)
              // 값이 없을 경우를 대비해 0으로 초기화
              const netAmountRaw = record.amount ? String(record.amount).replace(/,/g, "") : "0";
              const netAmountNum = Number(netAmountRaw);

              // 2. 원금 계산 (입금액 / 0.9)
              // 만약 originalAmount가 이미 있으면 쓰고, 없으면 계산
              let calculatedOriginal = "0";
              if (record.originalAmount && record.originalAmount !== "0") {
                calculatedOriginal = String(record.originalAmount).replace(/,/g, "");
              } else {
                calculatedOriginal = netAmountNum > 0 ? (netAmountNum / 0.9).toFixed(0) : "0";
              }

              // 3. 수수료 계산 (원금 * 0.1)
              let calculatedFee = "0";
              if (record.fee && record.fee !== "0") {
                calculatedFee = String(record.fee).replace(/,/g, "");
              } else {
                calculatedFee = (Number(calculatedOriginal) * 0.1).toFixed(0);
              }

              return (
                  <TableRow key={record.id} className="hover:bg-slate-50/50 border-0 transition-colors align-middle">
                    <TableCell className="py-4 align-middle text-center">{record.userId}</TableCell>
                    <TableCell className="py-4 align-middle text-center">{record.referenceId}</TableCell>

                    {/* 💡 계산된 값들을 formatAmount로 예쁘게 출력 */}
                    <TableCell className="py-4 text-right align-middle pr-10">{formatAmount(calculatedOriginal)}원</TableCell>
                    <TableCell className="py-4 text-right align-middle pr-10">{formatAmount(calculatedFee)}원</TableCell>
                    <TableCell className="py-4 font-bold text-emerald-600 text-right align-middle pr-10">
                      {formatAmount(netAmountRaw)}원
                    </TableCell>

                    <TableCell className="py-4 text-slate-600 align-middle text-center">{record.createdAt}</TableCell>
                  </TableRow>
              )
            })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    )
  } else {
    // 지갑 입출금 로그: [유저 ID, 유형, 금액, 설명, 일시]
    return (
      <div className="space-y-4">
        {/* 필터 UI */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-600 mb-2 block">거래 유형</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">전체</option>
              <option value="SETTLEMENT">입금(+)</option>
              <option value="WITHDRAW">출금(-)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-600 mb-2 block">유저 ID</label>
            <input
              type="text"
              placeholder="유저 ID 입력"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => {
              setFilterType("");
              setFilterUserId("");
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-sm transition"
          >
            초기화
          </button>
        </div>

        {/* 필터 결과 표시 */}
        {filteredTransactions.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-xl bg-white p-6">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-slate-600">필터에 일치하는 데이터가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-xl bg-white overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-0">
                  <TableHead className="w-[10%] text-center h-16 align-middle text-slate-500 font-medium text-xs">유저 ID</TableHead>
                  <TableHead className="w-[15%] text-center h-16 align-middle text-slate-500 font-medium text-xs">유형</TableHead>
                  <TableHead className="w-[20%] text-right h-16 align-middle pr-10 text-slate-500 font-medium text-xs">금액</TableHead>
                  <TableHead className="w-[35%] text-center h-16 align-middle text-slate-500 font-medium text-xs">설명</TableHead>
                  <TableHead className="w-[20%] text-center h-16 align-middle text-slate-500 font-medium text-xs">일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((record) => {
                  const transactionType = record.type === 'SETTLEMENT' ? '입금(+)' : '출금(-)'
                  return (
                    <TableRow key={record.id} className="hover:bg-slate-50/50 border-0 transition-colors align-middle">
                      <TableCell className="py-4 align-middle text-center">{record.userId}</TableCell>
                  <TableCell className="py-4 align-middle text-center">
                    <Badge className={`border-0 px-3 py-1 text-xs font-medium rounded-full ${
                      record.type === 'SETTLEMENT' ? 'bg-green-50 text-green-700' :
                      record.type === 'WITHDRAW' ? 'bg-blue-50 text-blue-700' :
                      'bg-slate-50 text-slate-700'
                    }`}>
                      {transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-slate-900 text-right align-middle pr-10">{formatAmount(record.amount)}원</TableCell>
                  <TableCell className="py-4 text-slate-600 align-middle text-center">{record.description}</TableCell>
                  <TableCell className="py-4 text-slate-600 align-middle text-center">{record.createdAt}</TableCell>
                </TableRow>
              )
            })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    )
  }
}

// --- ⭐ 메인 페이지 컴포넌트 (가짜 데이터 포함) ---
// 이 컴포넌트는 더 이상 사용하지 않습니다. app/admin/settlement-management/page.tsx를 사용하세요.