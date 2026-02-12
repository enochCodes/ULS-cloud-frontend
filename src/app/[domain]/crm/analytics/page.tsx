"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Activity, BrainCircuit } from "lucide-react"

// Mock Data
const kpis = [
    { title: "Projected Revenue", value: "$124,500", change: "+12%", icon: DollarSign },
    { title: "Win Rate", value: "64%", change: "+4%", icon: TrendingUp },
    { title: "Active Leads", value: "45", change: "+8", icon: Users },
    { title: "Avg. Deal Size", value: "$8,200", change: "+2%", icon: Activity },
]

const forecastData = [
    { month: "Jan", actual: 65, projected: 70 },
    { month: "Feb", actual: 58, projected: 62 },
    { month: "Mar", actual: 80, projected: 75 },
    { month: "Apr", actual: 85, projected: 90 },
    { month: "May", actual: 0, projected: 95 }, // Future
    { month: "Jun", actual: 0, projected: 100 }, // Future
]

const leadScores = [
    { label: "High Intent (>80)", count: 12, percent: 30, color: "bg-emerald-500" },
    { label: "Medium Intent (50-80)", count: 20, percent: 50, color: "bg-amber-500" },
    { label: "Low Intent (<50)", count: 8, percent: 20, color: "bg-slate-500" },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">AI Analytics</h1>
                    <p className="text-muted-foreground">Intelligence enabling smarter decisions.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-medium border border-indigo-500/20">
                    <BrainCircuit className="h-3 w-3" />
                    <span>Powered by Cortex AI</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Forecast Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Forecast</CardTitle>
                        <CardDescription>Actual vs. Projected Revenue (Q1-Q2)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end justify-between gap-2 mt-4 px-2">
                            {forecastData.map((d) => (
                                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div className="w-full flex gap-1 items-end justify-center h-full">
                                        {d.actual > 0 && (
                                            <div 
                                                className="w-full bg-indigo-600 rounded-t-sm transition-all hover:bg-indigo-500" 
                                                style={{ height: `${d.actual}%` }}
                                            />
                                        )}
                                        <div 
                                            className="w-full bg-indigo-200/20 border border-dashed border-indigo-500/30 rounded-t-sm" 
                                            style={{ height: `${d.projected}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">{d.month}</span>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded border shadow-lg z-10 whitespace-nowrap">
                                        Projected: {d.projected}% {d.actual > 0 ? `| Actual: ${d.actual}%` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                                <span>Actual</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-indigo-200/20 border border-dashed border-indigo-500/30 rounded-sm"></div>
                                <span>Projected AI</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lead Scoring & Sentiment */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Scoring Distribution</CardTitle>
                            <CardDescription>AI-evaluated conversion likelihood.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {leadScores.map(score => (
                                <div key={score.label} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{score.label}</span>
                                        <span className="text-muted-foreground">{score.count} leads ({score.percent}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className={`h-full ${score.color}`} style={{ width: `${score.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Sentiment</CardTitle>
                            <CardDescription>Tone analysis of recent emails & calls.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-6">
                                <div className="relative h-32 w-32 flex items-center justify-center">
                                    {/* Simple Donut Chart Representation using conic-gradient */}
                                    <div 
                                        className="absolute inset-0 rounded-full" 
                                        style={{ background: 'conic-gradient(#10b981 0% 65%, #f59e0b 65% 85%, #ef4444 85% 100%)' }} 
                                    />
                                    <div className="absolute inset-2 bg-card rounded-full flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold">8.5</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Score</span>
                                    </div>
                                </div>
                                <div className="ml-8 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>Positive (65%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span>Neutral (20%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <span>Negative (15%)</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
