"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { WithdrawalTable, SettlementHistoryTable, type WithdrawalRequest, type SettlementRecord } from "@/components/admin/settlement-management-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api-client"

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

export default function SettlementManagementPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [walletTransactions, setWalletTransactions] = useState<WalletTransactionRecord[]>([])
  const [loading, setLoading] = useState(false)

  // 💡 날짜 포맷팅 유틸 함수 (T 제거 및 읽기 좋은 형식으로 변환)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === "-") return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/\. /g, '-').replace('.', '');
    } catch (e) {
      return dateString.replace('T', ' '); // 예외 시 단순 T 치환
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [withdrawalsResponse, settlementsResponse] = await Promise.all([
          apiFetch("/api/admin/withdrawals"),
          apiFetch("/api/admin/settlements"),
        ])

        if (!withdrawalsResponse.ok || !settlementsResponse.ok) {
          throw new Error(`데이터 로드 실패: W(${withdrawalsResponse.status}) / S(${settlementsResponse.status})`)
        }

        const withdrawalsJson = await withdrawalsResponse.json()
        const settlementsJson = await settlementsResponse.json()

        const withdrawalsArray = withdrawalsJson.content ?? withdrawalsJson
        const settlementsArray = settlementsJson.content ?? settlementsJson

        // 1. 출금 신청 목록 매핑
        setWithdrawals(
            withdrawalsArray.map((item: any) => ({
              id: String(item.id),
              userId: String(item.memberId || "-"),
              bankName: item.bankName ?? item.bank ?? "-",
              accountNumber: item.accountNumber ?? "-",
              // 💡 계산을 위해 "원"을 붙이지 않고 숫자나 순수 문자열만 보냅니다.
              amount: String(item.amount ?? item.requestAmount ?? "0"),
              requestedAt: formatDate(item.requestedAt ?? item.createdAt),
              status: item.status ?? "PENDING",
              rejectReason: item.rejectReason,
            })) as WithdrawalRequest[],
        )

        // 2. 지갑 트랜잭션 매핑 (page.tsx 내부)
        setWalletTransactions(
            settlementsArray.map((item: any) => ({
              id: String(item.id),
              userId: String(item.userId || item.memberId || "-"),
              amount: String(item.amount || "0"),
              originalAmount: String(item.originalAmount || "0"),
              fee: String(item.fee || "0"),
              type: item.type || "SETTLEMENT",
              status: item.status || "COMPLETED",
              referenceId: String(item.referenceId || "-"),
              description: item.description || "",
              createdAt: formatDate(item.createdAt),
            })) as WalletTransactionRecord[],
        )
      } catch (error) {
        console.error("정산 데이터 로드 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleApprove = async (withdrawalId: string) => {
    // 💡 관리자에게 한 번 더 물어보는 센스!
    if (!confirm("정말 이 출금 요청을 승인하시겠습니까? 유저의 잔액이 차감됩니다.")) {
      return;
    }
    try {
      const response = await apiFetch(`/api/admin/withdrawals/${withdrawalId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        // 💡 백엔드에서 던진 "잔액 부족" 등의 에러 메시지를 받아서 보여줍니다.
        const errorMessage = await response.text();
        throw new Error(errorMessage || "승인 처리 실패");
      }

      // ✅ 성공 시: 목록에서 해당 항목의 상태를 즉시 업데이트
      setWithdrawals((prev) =>
          prev.map((withdrawal) =>
              withdrawal.id === withdrawalId
                  ? { ...withdrawal, status: "COMPLETED" }
                  : withdrawal,
          ),
      )
      alert("출금 승인이 완료되었습니다.");
    } catch (error: any) {
      console.error("승인 오류:", error)
      alert(error.message || "출금 요청 승인 중 오류가 발생했습니다.")
    }
  }

  const handleReject = async (withdrawalId: string, reason: string) => {
    if (!reason.trim()) {
      alert("반려 사유를 입력해주세요.")
      return
    }

    try {
      const response = await apiFetch(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        method: "POST",
        body: JSON.stringify(reason)
      });

      if (!response.ok) throw new Error("반려 처리 실패");

      setWithdrawals((prev) =>
          prev.map((withdrawal) =>
              withdrawal.id === withdrawalId
                  ? { ...withdrawal, status: "REJECTED", rejectReason: reason.trim() }
                  : withdrawal,
          ),
      )
    } catch (error) {
      console.error("반려 오류:", error);
      alert("반려 처리 중 오류가 발생했습니다.");
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminHeader />
        <main className="mx-auto max-w-[1200px] px-6 pt-28 pb-12 space-y-10">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">정산 관리</h1>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              출금 신청과 정산 이력을 한곳에서 확인하고 처리할 수 있습니다.
            </p>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">출금 신청 목록</h2>
                <p className="text-sm text-slate-600 mt-1">승인 또는 반려 처리할 출금 요청을 확인하세요.</p>
              </div>
              <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                총 {withdrawals.length}건
              </div>
            </div>
            <WithdrawalTable withdrawals={withdrawals} onApprove={handleApprove} onReject={handleReject} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
              <h2 className="text-2xl font-semibold text-slate-800">지갑 트랜잭션</h2>
              <p className="text-sm text-slate-600 mt-1">퀘스트 정산과 입출금 내역을 확인합니다.</p>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              총 {walletTransactions.length}건
            </div>
          </div>
          <Tabs defaultValue="settlement" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
              <TabsTrigger value="settlement" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">퀘스트 정산 이력</TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">지갑 입출금 로그</TabsTrigger>
            </TabsList>
            <TabsContent value="settlement" className="mt-6">
              <SettlementHistoryTable
                transactions={walletTransactions.filter(t => t.type === 'SETTLEMENT')}
                showSettlementColumns={true}
              />
            </TabsContent>
            <TabsContent value="transactions" className="mt-6">
              <SettlementHistoryTable
                transactions={walletTransactions}
                showSettlementColumns={false}
              />
            </TabsContent>
          </Tabs>
        </section>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-sm text-slate-600">데이터를 로드하는 중입니다...</span>
          </div>
        )}
      </main>
    </div>
  )
}