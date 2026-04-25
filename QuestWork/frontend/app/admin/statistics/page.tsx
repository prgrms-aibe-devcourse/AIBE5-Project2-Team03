"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, AlertCircle, RefreshCcw, Clock, Info, Banknote } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, BarChart, Bar } from 'recharts'
import { AdminHeader } from "@/components/admin/admin-header"

interface DailyRevenue {
  date: string
  amount: number
}

interface StatisticsData {
  todayFeeRevenue: number
  availableBalance: number
  totalLockedEscrow: number
  pendingWithdrawalCount: number
  releasedAmountToday: number | null
  refundedAmountToday: number | null
  dailyRevenues: DailyRevenue[]
  monthlyRevenues: DailyRevenue[]
}

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [chartTab, setChartTab] = useState<'weekly' | 'monthly'>('weekly')

  const fetchStatistics = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats/summary'),
        fetch('http://localhost:8000/api/admin/users?page=0&size=1'),
      ])
      if (!statsRes.ok) throw new Error(`통계 데이터 로드 실패 (${statsRes.status})`)
      const result: StatisticsData = await statsRes.json()
      setData(result)

      if (usersRes.ok) {
        const usersJson = await usersRes.json()
        setTotalUsers(usersJson.totalElements ?? 0)
      }
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatistics() }, [])

  const fmt = (amount: number | null | undefined) =>
    new Intl.NumberFormat('ko-KR').format(amount ?? 0) + '원'

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <AdminHeader />
        <div className="flex items-center justify-center pt-40 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
          <span className="text-slate-500 font-medium">데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <AdminHeader />
        <div className="flex flex-col items-center justify-center pt-40 gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-slate-600 font-medium">{error}</p>
          <Button onClick={fetchStatistics} variant="outline">다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-10">

        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 통계</h1>
            <p className="text-slate-500 mt-2 font-medium">플랫폼의 수익성과 활성도를 분석합니다.</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-widest">최종 업데이트: {lastUpdated}</span>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="오늘 발생 수수료"
            value={fmt(data?.todayFeeRevenue)}
            desc="오늘 정산으로 발생한 순수익"
            icon={<TrendingUp className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="인출 가능 잔액"
            value={fmt(data?.availableBalance)}
            desc="누적 플랫폼 수수료 합계"
            icon={<Banknote className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="총 예치 잔액"
            value={fmt(data?.totalLockedEscrow)}
            desc="에스크로 보관 금액 (LOCKED)"
            icon={<DollarSign className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="출금 대기"
            value={`${data?.pendingWithdrawalCount ?? 0}건`}
            desc="빠른 승인이 필요한 요청"
            icon={<AlertCircle className="w-5 h-5" />}
            color="amber"
          />
        </div>

        {/* 보조 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">오늘 지급 완료액</p>
              <p className="text-2xl font-black text-slate-800">{fmt(data?.releasedAmountToday)}</p>
              <p className="text-sm text-slate-400 mt-1">에스크로 → 개발자 지갑으로 이동</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">오늘 환불액</p>
              <p className="text-2xl font-black text-slate-800">{fmt(data?.refundedAmountToday)}</p>
              <p className="text-sm text-slate-400 mt-1">에스크로 → 매니저 지갑으로 반환</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">전체 회원 수</p>
              <p className="text-2xl font-black text-slate-800">{totalUsers.toLocaleString()}명</p>
              <p className="text-sm text-slate-400 mt-1">가입된 전체 유저</p>
            </CardContent>
          </Card>
        </div>

        {/* 주간 / 월간 수익 차트 */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {chartTab === 'weekly' ? '주간 플랫폼 순수익' : '월간 플랫폼 순수익'}
                <Info className="w-4 h-4 text-slate-300 cursor-help" />
              </CardTitle>
              <p className="text-sm text-slate-400 font-medium">서비스 이용료(수수료)로 발생한 실제 매출 추이입니다.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* 탭 버튼 */}
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setChartTab('weekly')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    chartTab === 'weekly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  주간
                </button>
                <button
                  onClick={() => setChartTab('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    chartTab === 'monthly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  월간
                </button>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-4 py-1.5 rounded-lg">
                Revenue Analysis
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {chartTab === 'weekly' ? (
              (!data?.dailyRevenues || data.dailyRevenues.length === 0) ? (
                <div className="h-75 flex items-center justify-center text-slate-400 font-medium">
                  아직 집계된 주간 수익 데이터가 없습니다.
                </div>
              ) : (
                <div className="h-100 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.dailyRevenues}
                      margin={{ top: 40, right: 30, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                        tick={{ dy: 12 }}
                        tickFormatter={(str) => str.split('-').slice(1).join('/')}
                      />
                      <YAxis
                        stroke="#cbd5e1"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, (dataMax: number) => Math.max(dataMax * 1.3, 10000)]}
                        tickFormatter={(val) => {
                          if (val >= 10000000) return `${(val / 10000000).toFixed(1)}천만`
                          if (val >= 10000) return `${(val / 10000).toLocaleString()}만`
                          return `${val.toLocaleString()}`
                        }}
                        tick={{ dx: -10 }}
                      />
                      <Tooltip
                        cursor={{ stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px',
                          fontSize: '12px',
                        }}
                        formatter={(value: number) => [value.toLocaleString() + '원', '플랫폼 순수익']}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      >
                        <LabelList
                          dataKey="amount"
                          position="top"
                          content={(props: any) => {
                            const { x, y, value } = props
                            if (!value) return null
                            const formatted = value >= 10000
                              ? `${(value / 10000).toLocaleString()}만`
                              : value.toLocaleString()
                            return (
                              <text x={x} y={y} dy={-15} fill="#64748b" fontSize={10} fontWeight="700" textAnchor="middle">
                                {formatted}
                              </text>
                            )
                          }}
                        />
                      </Area>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )
            ) : (
              (!data?.monthlyRevenues || data.monthlyRevenues.length === 0) ? (
                <div className="h-75 flex items-center justify-center text-slate-400 font-medium">
                  아직 집계된 월간 수익 데이터가 없습니다.
                </div>
              ) : (
                <div className="h-100 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.monthlyRevenues}
                      margin={{ top: 40, right: 30, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                        tick={{ dy: 12 }}
                        tickFormatter={(str) => {
                          const parts = str.split('-')
                          return parts.length >= 2 ? `${parts[0].slice(2)}/${parts[1]}` : str
                        }}
                      />
                      <YAxis
                        stroke="#cbd5e1"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, (dataMax: number) => Math.max(dataMax * 1.3, 10000)]}
                        tickFormatter={(val) => {
                          if (val >= 10000000) return `${(val / 10000000).toFixed(1)}천만`
                          if (val >= 10000) return `${(val / 10000).toLocaleString()}만`
                          return `${val.toLocaleString()}`
                        }}
                        tick={{ dx: -10 }}
                      />
                      <Tooltip
                        cursor={{ fill: '#6366f1', fillOpacity: 0.05 }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px',
                          fontSize: '12px',
                        }}
                        formatter={(value: number) => [value.toLocaleString() + '원', '월간 순수익']}
                        labelFormatter={(label) => {
                          const parts = label.split('-')
                          return parts.length >= 2 ? `${parts[0]}년 ${parts[1]}월` : label
                        }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="url(#colorMonthly)"
                        radius={[6, 6, 0, 0]}
                      >
                        <LabelList
                          dataKey="amount"
                          position="top"
                          content={(props: any) => {
                            const { x, y, width, value } = props
                            if (!value) return null
                            const formatted = value >= 10000
                              ? `${(value / 10000).toLocaleString()}만`
                              : value.toLocaleString()
                            return (
                              <text x={x + (width ?? 0) / 2} y={y} dy={-10} fill="#64748b" fontSize={10} fontWeight="700" textAnchor="middle">
                                {formatted}
                              </text>
                            )
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={fetchStatistics}
            className="bg-slate-900 hover:bg-black text-white px-12 py-7 rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 gap-3 font-bold text-lg"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            데이터 새로고침
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, desc, icon, color }: {
  title: string
  value: string
  desc: string
  icon: React.ReactNode
  color: 'blue' | 'emerald' | 'purple' | 'amber'
}) {
  const themes = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  }
  return (
    <Card className="border-0 shadow-sm rounded-3xl bg-white hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${themes[color]}`}>
          {icon}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="text-3xl font-black text-slate-900">{value}</div>
          <p className="text-sm text-slate-400 font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}