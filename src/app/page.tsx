"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import {
    ArrowRight,
    MessageSquare,
    Package,
    BarChart3,
    Shield,
    Layers,
    Cpu,
    BrainCircuit,
    Sparkles,
    MousePointer2
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRef } from "react"

export default function MarketingPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Gentler scroll animation - avoid blurry/fast fade (extended range 0-0.6)
    const opacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 0.9, 0.3])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98])

    return (
        <div ref={containerRef} className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full border-b bg-background/40 backdrop-blur-2xl transition-all duration-300">
                <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">ULS <span className="text-primary not-italic">AI.Cloud</span></span>
                    </div>
                    <nav className="hidden lg:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                        <Link href="#features" className="hover:text-primary transition-all">Capabilities</Link>
                        <Link href="#infrastructure" className="hover:text-primary transition-all">Infrastructure</Link>
                        <Link href="#access" className="hover:text-primary transition-all">Deploy</Link>
                    </nav>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link href="/auth/login" className="hidden sm:block text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            Access Portal
                        </Link>
                        <Link href="/auth/register">
                            <Button size="lg" className="rounded-2xl px-8 font-black uppercase tracking-widest shadow-2xl shadow-primary/20 bg-primary hover:scale-105 transition-transform">
                                Deploy Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* AI-Native Hero Section */}
                <section className="relative flex flex-col items-center justify-center pt-32 pb-32 lg:pt-40 lg:pb-64 overflow-hidden">
                    {/* Immersive Neural Background */}
                    <div className="absolute top-0 left-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
                        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[180px] animate-pulse" />
                        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[150px] animate-pulse duration-[4s]" />
                        <div className="absolute inset-0 opacity-[0.05]"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
                    </div>

                    <motion.div
                        style={{ opacity, scale }}
                        className="w-full max-w-[1440px] px-6 lg:px-12 flex flex-col items-center text-center relative"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-10 max-w-6xl"
                        >
                            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                                <Sparkles className="h-4 w-4 fill-current" />
                                AI-Native Sovereignty • Release 2026.1
                            </div>
                            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.8] text-balance">
                                Neural <span className="text-primary">Ecosystem</span> <br />
                                <span className="opacity-50 font-light italic tracking-tight">Evolved.</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-muted-foreground/80 mx-auto max-w-4xl leading-relaxed font-medium tracking-tight">
                                More than a cloud. A living, breathing intelligence layer that orchestrates your enterprise modules with sub-millisecond precision.
                            </p>
                        </motion.div>

                        {/* Interactive Neural Core Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                            className="mt-24 relative h-96 w-96 flex items-center justify-center group cursor-crosshair"
                        >
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[100px] animate-pulse group-hover:bg-primary/30 transition-all" />
                            <div className="relative h-64 w-64 rounded-full border-2 border-primary/30 bg-black/40 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_80px_rgba(var(--primary),0.3)]">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-2 rounded-full border border-dashed border-primary/20"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-8 rounded-full border-2 border-primary/10"
                                />
                                <div className="z-10 flex flex-col items-center gap-2">
                                    <Cpu className="h-16 w-16 text-primary animate-bounce" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Core Sync</span>
                                </div>
                            </div>

                            {/* Orbital Nodes */}
                            {[0, 120, 240].map((angle, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: angle + 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute h-12 w-12 rounded-xl bg-card border border-primary/20 flex items-center justify-center shadow-xl group-hover:scale-125 transition-transform"
                                    style={{ transform: `rotate(${angle}deg) translate(180px) rotate(-${angle}deg)` }}
                                >
                                    {i === 0 ? <BrainCircuit className="h-6 w-6 text-primary" /> : i === 1 ? <MessageSquare className="h-6 w-6 text-blue-500" /> : <BarChart3 className="h-6 w-6 text-purple-500" />}
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-20 flex flex-col sm:flex-row items-center gap-8"
                        >
                            <Link href="/auth/register">
                                <Button size="lg" className="h-20 px-16 text-2xl font-black rounded-[2rem] shadow-[0_30px_60px_rgba(var(--primary),0.4)] hover:shadow-[0_40px_80px_rgba(var(--primary),0.5)] transition-all group overflow-hidden relative">
                                    <span className="relative z-10 flex items-center gap-4">Initialize Growth <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" /></span>
                                    <motion.div
                                        className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                                    />
                                </Button>
                            </Link>
                            <Link href="/marketplace">
                                <Button variant="ghost" size="lg" className="h-20 px-16 text-2xl font-bold rounded-[2rem] hover:bg-primary/5 group border border-transparent hover:border-primary/20">
                                    Simulation Hub <MousePointer2 className="ml-4 h-6 w-6 text-primary group-hover:rotate-45 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* AI Strategy Grid */}
                <section id="features" className="py-40 bg-card/40 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 0), linear-gradient(90deg, currentColor 1px, transparent 0)', backgroundSize: '120px 120px' }} />

                    <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-8">
                            <div className="space-y-6">
                                <div className="h-1 w-24 bg-primary rounded-full" />
                                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">AI Intelligence <br /><span className="opacity-20 italic">At Every Node.</span></h1>
                                <p className="text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">No plugins. No bolt-ons. Artificial intelligence is fused into the very silicon of our cloud stack.</p>
                            </div>
                            <Link href="/auth/register">
                                <Button variant="outline" size="lg" className="rounded-2xl font-black uppercase tracking-widest px-12 border-2 h-16 hover:bg-primary hover:text-white transition-all">Sovereign Protocol</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                { title: "Neural CRM", icon: BrainCircuit, desc: "Autonomous relationship management that predicts churn and anticipates needs before engagement.", color: "from-primary/30", ai: "Available", available: true, href: "/auth/register" },
                                { title: "Quantum Support", icon: MessageSquare, desc: "AI-native ticketing that resolves 80% of issues autonomously via neural linguistic processing.", color: "from-blue-600/30", ai: "Coming Soon", available: false, href: "#" },
                                { title: "Sync Inventory", icon: Package, desc: "Hyper-accurate supply chain sync leveraging predictive logistics and global telemetry.", color: "from-purple-600/30", ai: "Coming Soon", available: false, href: "#" },
                                { title: "Edge Analytics", icon: BarChart3, desc: "Sub-millisecond decisioning powered by local organizational LLMs isolated for security.", color: "from-orange-600/30", ai: "Coming Soon", available: false, href: "#" },
                                { title: "Isolated Auth", icon: Shield, desc: "Biometric and behavioral-based zero-trust security that evolves with your threat landscape.", color: "from-green-600/30", ai: "Coming Soon", available: false, href: "#" },
                                { title: "App Forge", icon: Layers, desc: "Generate entire enterprise modules using low-code AI agents in a sandbox environment.", color: "from-red-600/30", ai: "Coming Soon", available: false, href: "#" },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "0px 0px 50px 0px", amount: 0.2 }}
                                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                                    whileHover={{ y: -8, scale: 1.01 }}
                                    className="group p-12 rounded-[3rem] border border-border/50 bg-background/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-700 relative overflow-hidden"
                                >
                                    <div className={`absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${feature.available ? "text-primary/50 border border-primary/20" : "text-muted-foreground/70 border border-muted-foreground/20"}`}>{feature.ai}</div>
                                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${feature.color} to-transparent flex items-center justify-center text-primary mb-10 group-hover:rotate-[360deg] transition-transform duration-1000`}>
                                        <feature.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-6 tracking-tighter">{feature.title}</h3>
                                    <p className="text-xl text-muted-foreground/80 leading-relaxed font-medium">{feature.desc}</p>
                                    <div className="mt-8 pt-8 border-t border-border/50 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        {feature.available ? (
                                            <Link href={feature.href} className="flex items-center gap-2 hover:underline">
                                                Get Started <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground">{feature.ai}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Processing Stream Simulation */}
                <section id="infrastructure" className="py-32 bg-black text-white relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 flex flex-col justify-around pointer-events-none">
                        {[1, 2, 3, 4, 5].map(i => (
                            <motion.div
                                key={i}
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                                className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                            />
                        ))}
                    </div>
                    <div className="relative z-10 text-center space-y-6">
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Neural Processing Core</h3>
                        <p className="text-primary font-mono text-sm tracking-[0.5em] uppercase">Status: All Systems Nominal • Latency: 0.12ms</p>
                    </div>
                </section>

                {/* Final Ecosystem CTA */}
                <section id="access" className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-primary selection:bg-white/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]" />

                    <div className="container relative z-10 text-center space-y-20 px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, margin: "-20%" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-8xl md:text-[12rem] font-black tracking-tighter text-primary-foreground leading-[0.75]">
                                THE AI <br /> <span className="opacity-30 italic">CONVERGENCE.</span>
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-primary-foreground/80 max-w-4xl mx-auto">
                                The transition is mandatory. The benefits are absolute. <br />Welcome to the Neural Age.
                            </p>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link href="/auth/register">
                                <Button size="lg" variant="secondary" className="h-24 px-20 text-3xl font-black rounded-[2.5rem] shadow-3xl hover:scale-110 transition-transform">Claim Workspace</Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button size="lg" variant="outline" className="h-24 px-20 text-3xl font-black rounded-[2.5rem] bg-transparent border-primary-foreground text-primary-foreground hover:bg-white hover:text-primary transition-all">Member Entry</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t py-32 bg-card/50">
                <div className="mx-auto flex flex-col items-center text-center gap-16 max-w-[1440px] px-6 lg:px-12">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black shadow-xl">
                            <BrainCircuit className="h-8 w-8" />
                        </div>
                        <span className="text-4xl font-black tracking-tighter uppercase italic">ULS <span className="text-primary not-italic">AI.Cloud</span></span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-20 w-full text-left">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Neural Nodes</h4>
                            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">CRM Intelligence</Link></li>
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Quantum Support</Link></li>
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Global Telemetry</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Sovereignty</h4>
                            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                                <li><Link href="/auth/login" className="hover:text-primary transition-colors">Zero-Trust Protocol</Link></li>
                                <li><Link href="/auth/login" className="hover:text-primary transition-colors">Isolated Data</Link></li>
                                <li><Link href="/auth/login" className="hover:text-primary transition-colors">Governance API</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">App Forge</h4>
                            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Module Creation</Link></li>
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Agent Sandbox</Link></li>
                                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6 text-right flex flex-col items-end">
                            <p className="text-xl font-black italic max-w-xs">Engineered for absolute organizational control.</p>
                            <div className="flex gap-4 mt-6">
                                {[1, 2, 3].map(i => <div key={i} className="h-10 w-10 rounded-xl bg-muted hover:bg-primary/20 transition-all cursor-pointer" />)}
                            </div>
                        </div>
                    </div>

                    <div className="w-full pt-16 border-t flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black tracking-[0.2em] text-muted-foreground/40">
                        <p>© 2026 UNITY LINK SOLUTIONS AI CLOUD SERVICE. NEURAL CORE NOMINAL.</p>
                        <div className="flex gap-12">
                            <Link href="/auth/register" className="hover:text-primary transition-colors">PROTOCOL</Link>
                            <Link href="/auth/login" className="hover:text-primary transition-colors">PRIVACY</Link>
                            <Link href="/auth/login" className="hover:text-primary transition-colors">AUTH SEGMENT</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
