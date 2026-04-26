"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin/admin-header" // 경로 프로젝트에 맞게 확인!
import { TrendingUp, AlertCircle, RefreshCcw, Clock, Info, Calendar, Wallet, Lock } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { apiFetch } from "@/lib/api-client"

interface StatisticsData {
    todayFeeRevenue: number;
    monthFeeRevenue: number;
    availableBalance: number;
    totalLockedEscrow: number;
    pendingWithdrawalCount: number;
    dailyRevenues: any[];
    monthlyRevenues: any[];
}

export default function StatisticsPage() {
    const [data, setData] = useState<StatisticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly');

    const fetchStatistics = async () => {
        setLoading(true)
        try {
            const response = await apiFetch('/api/admin/stats/summary')
            if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.')
            const result = await response.json()
            setData(result)
            setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }))
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStatistics() }, [])

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-slate-500 font-bold">데이터를 불러오는 중...</div>;
    if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* 1. 헤더 (최상단 고정) */}
            <AdminHeader />

            {/* 2. 메인 컨텐츠 영역 */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 space-y-10 w-full">

                {/* 헤더 섹션 (제목 및 업데이트 시간) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 통계</h1>
                        <p className="text-slate-500 mt-2 font-medium">플랫폼의 수익성과 활성도를 분석합니다.</p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200 w-fit">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">실시간 동기화 완료: {lastUpdated}</span>
                    </div>
                </div>

                {/* 상단 카드 섹션 (메인 수익 카드 + 요약 카드들) */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                        <Card className="h-full border-0 shadow-2xl bg-[#1e293b] text-white rounded-[32px] overflow-hidden relative group min-h-[240px]">
                            <div className="absolute -right-4 -top-4 w-48 h-48 bg-blue-500/20 blur-[60px] group-hover:bg-blue-500/30 transition-all duration-700" />
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-[50px]" />

                            <CardContent className="p-10 flex flex-col justify-between h-full relative z-10">
                                <div className="w-12 h-12 bg-blue-400/10 border border-blue-400/20 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="text-emerald-400 w-6 h-6" />
                                </div>
                                <div className="mt-12">
                                    <p className="text-blue-200/60 text-[11px] font-black uppercase tracking-[0.25em] mb-2">Today's Revenue</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-5xl font-black tracking-tighter text-slate-50">
                                            {data?.todayFeeRevenue?.toLocaleString() || '0'}
                                        </h2>
                                        <span className="text-lg font-bold text-blue-200/50">원</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SmallStatsCard title="이번 달 누적 수익" value={data?.monthFeeRevenue} icon={<Calendar className="text-blue-500 w-5 h-5" />} />
                        <SmallStatsCard title="인출 가능 잔액" value={data?.availableBalance} icon={<Wallet className="text-purple-500 w-5 h-5" />} />
                        <SmallStatsCard title="현재 예치 잔액" value={data?.totalLockedEscrow} icon={<Lock className="text-slate-400 w-5 h-5" />} />
                        <SmallStatsCard title="출금 대기 건수" value={data?.pendingWithdrawalCount} unit="건" icon={<AlertCircle className="text-orange-500 w-5 h-5" />} />
                    </div>
                </div>

                {/* 그래프 섹션 */}
                <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                {chartMode === 'weekly' ? '주간 플랫폼 순수익' : '월간 플랫폼 순수익'}
                                <Info className="w-4 h-4 text-slate-300 cursor-help" />
                            </CardTitle>
                            <p className="text-sm text-slate-400 font-medium">서비스 이용료(수수료)로 발생한 실제 매출 추이입니다.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setChartMode('weekly')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                                        chartMode === 'weekly' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >주간</button>
                                <button
                                    onClick={() => setChartMode('monthly')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                                        chartMode === 'monthly' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >월간</button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartMode === 'weekly' ? data?.dailyRevenues : data?.monthlyRevenues}
                                    margin={{ top: 40, right: 30, left: 10, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" opacity={0.6} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            if (!str) return "";
                                            const parts = str.split('-');
                                            return chartMode === 'weekly' ? `${parts[1]}/${parts[2]}` : `${parseInt(parts[1])}월`;
                                        }}
                                    />
                                    <YAxis
                                        stroke="#cbd5e1"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => val >= 10000000 ? `${(val / 10000000).toFixed(1)}천만` : `${(val / 10000).toLocaleString()}만`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number, name: string) => [value.toLocaleString() + '원', name === "totalAmount" ? '총 거래액' : '플랫폼 순수익']}
                                    />
                                    <Area name="totalAmount" type="monotone" dataKey="totalAmount" stroke="#c4b5fd" fill="url(#colorTotal)" />
                                    <Area name="amount" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fill="url(#colorRevenue)">
                                        <LabelList dataKey="amount" position="top" content={(props: any) => {
                                            const { x, y, value } = props;
                                            return <text x={x} y={y} dy={-15} fill="#059669" fontSize={10} fontWeight="700" textAnchor="middle">{(value / 10000).toLocaleString()}만</text>;
                                        }} />
                                    </Area>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 하단 새로고침 버튼 */}
                <div className="flex justify-center pb-10">
                    <Button
                        onClick={fetchStatistics}
                        className="bg-slate-900 hover:bg-black text-white px-12 py-7 rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 gap-3 font-bold text-lg"
                    >
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        데이터 새로고침
                    </Button>
                </div>
            </main>
        </div>
    )
}

function SmallStatsCard({ title, value, unit = "원", icon }: any) {
    return (
        <Card className="border-0 shadow-sm rounded-[24px] bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 group">
            <CardContent className="p-6">
                <div className="flex items-center gap-5">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-slate-100/50">
                        {icon}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {typeof value === 'number' ? value.toLocaleString() : (value || '0')}
                            </span>
                            <span className="text-xs font-bold text-slate-600">{unit}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}