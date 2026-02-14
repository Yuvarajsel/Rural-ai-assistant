"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Share2, Activity } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import LiveBackground from "@/components/LiveBackground";
import { motion } from "framer-motion";

interface AnalysisResult {
    probable_condition: string;
    disease_stage: string;
    risk_level: string;
    detailed_explanation: string;
    treatment_guidance: string;
    medications: string[];
    patient_dos: string[];
    patient_donts: string[];
    referral_recommendation: string;
}

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve data from session storage
        const storedData = sessionStorage.getItem("analysisResult");
        if (storedData) {
            setResult(JSON.parse(storedData));
        }
        setLoading(false);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d47a1] to-[#1976d2] flex items-center justify-center text-white">
            <div className="text-center">
                <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-300" />
                <h2 className="text-xl font-bold">Securely Retrieving Report...</h2>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-[#0d47a1] to-[#1976d2] text-white">
            {/* Live Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <LiveBackground />
                </div>
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a2472]/60 to-[#0a2472]/90 pointer-events-none"></div>
            </div>

            {/* Glassmorphic Header */}
            <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-12 sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium bg-white/5 hover:bg-white/20 px-4 py-2 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return Home
                    </button>
                    <h1 className="text-lg font-bold tracking-wide hidden md:block bg-[linear-gradient(110deg,#ffffff,45%,#93c5fd,55%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                        Clinical Diagnostic Report
                    </h1>
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-white/20 rounded-full text-blue-100 hover:text-white transition-all border border-white/10" title="Download PDF">
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white/20 rounded-full text-blue-100 hover:text-white transition-all border border-white/10" title="Share Securely">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                {result ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {/* Card Glow Effect */}
                        <div className="absolute -inset-4 bg-blue-500/30 rounded-[2rem] blur-2xl -z-10"></div>

                        {/* The Result Card itself (White Paper style against the dark tech background) */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header Strip for the Card */}
                            <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidential Medical Record</span>
                                <span className="text-xs font-mono text-slate-400">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                            <div className="p-2">
                                <ResultCard result={result} loading={false} />
                            </div>
                        </div>

                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                        <Activity className="w-16 h-16 text-blue-300 mx-auto mb-6 opacity-50" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Active Report</h2>
                        <p className="text-blue-200 mb-8">Please initiate a new analysis to generate diagnostic data.</p>
                        <button
                            onClick={() => router.push("/browse")}
                            className="bg-white text-[#0d47a1] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            Start New Analysis
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
