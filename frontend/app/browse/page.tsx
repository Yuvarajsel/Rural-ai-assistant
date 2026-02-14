"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Upload, FileText, Search, ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import FileUpload from "@/components/FileUpload";
import Header from "@/components/Header";
import LiveBackground from "@/components/LiveBackground";
import { cn } from "@/lib/utils";

export default function Browse() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"image" | "symptoms" | "report">("image");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);

        try {
            let endpoint = "";
            let body;
            let method = "POST";
            const baseUrl = "http://localhost:8000";

            if (activeTab === "image") {
                if (!imageFile) throw new Error("Please upload an image first.");
                endpoint = "/analyze-image";
                const formData = new FormData();
                formData.append("file", imageFile);
                body = formData;
            } else if (activeTab === "symptoms") {
                if (!symptoms) throw new Error("Please enter symptoms.");
                endpoint = `/analyze-symptoms?symptoms=${encodeURIComponent(symptoms)}`;
                body = null;
            } else if (activeTab === "report") {
                if (!reportFile) throw new Error("Please upload a report first.");
                endpoint = "/analyze-report";
                const formData = new FormData();
                formData.append("file", reportFile);
                body = formData;
            }

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: method,
                body: body,
            });

            if (!res.ok) throw new Error(`Server Error: ${res.statusText}`);

            const data = await res.json();

            // Save result and redirect
            sessionStorage.setItem("analysisResult", JSON.stringify(data));
            router.push("/result");

        } catch (err: any) {
            setError(err.message || "An error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-[#0d47a1] to-[#1976d2] text-white">
            <Header />

            {/* Live Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <LiveBackground />
                </div>
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a2472]/60 to-[#0a2472]/90 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20">

                {/* Header Text */}
                <div className="text-center space-y-4 mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-md bg-[linear-gradient(110deg,#ffffff,45%,#93c5fd,55%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer inline-block"
                    >
                        Clinical Analysis Engine
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-blue-100 max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        Select your data source type below to initialize the AI diagnostic protocol.
                        Results are generated in real-time.
                    </motion.p>
                </div>

                {/* Glassmrophic Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden"
                >
                    {/* Decorative element inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    {/* Tab Switcher */}
                    <div className="flex gap-4 mb-8 p-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/5 overflow-x-auto">
                        {(["image", "symptoms", "report"] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "flex-1 py-3 px-6 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-3",
                                    activeTab === tab
                                        ? "bg-white text-[#0d47a1] shadow-lg"
                                        : "text-blue-200 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {tab === "image" && <Upload className="w-4 h-4" />}
                                {tab === "symptoms" && <Activity className="w-4 h-4" />}
                                {tab === "report" && <FileText className="w-4 h-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} Controls
                            </motion.button>
                        ))}
                    </div>

                    {/* Input Area (Unified Height) */}
                    <div className="mb-8 min-h-[220px]">
                        {activeTab === "image" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Upload Diagnostic Imagery</h3>
                                    <p className="text-blue-200 text-sm mt-1">Accepts X-Rays, Dermoscopy, or standard clinical photography.</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    className="bg-white/5 border-2 border-dashed border-blue-300/30 rounded-2xl transition-colors cursor-pointer"
                                >
                                    <FileUpload label="Drop Clinical Image Here" accept="image/*" onFileSelect={setImageFile} />
                                </motion.div>
                            </motion.div>
                        )}
                        {activeTab === "symptoms" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Symptom Description</h3>
                                    <p className="text-blue-200 text-sm mt-1">Enter patient complaints, vitals, and onset history.</p>
                                </div>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.3)" }}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[160px] resize-none text-lg leading-relaxed transition-all"
                                    placeholder="e.g. Patient presents with acute abdominal pain, low-grade fever, and nausea..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </motion.div>
                        )}
                        {activeTab === "report" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Medical Report Analysis</h3>
                                    <p className="text-blue-200 text-sm mt-1">Upload PDF lab results or discharge summaries.</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    className="bg-white/5 border-2 border-dashed border-blue-300/30 rounded-2xl transition-colors cursor-pointer"
                                >
                                    <FileUpload label="Drop PDF Report Here" accept="application/pdf" onFileSelect={setReportFile} />
                                </motion.div>
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        onClick={handleAnalyze}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-blue-300 hover:to-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/50 disabled:opacity-70 disabled:cursor-not-allowed group border border-white/20"
                    >
                        {loading ? (
                            <>
                                <Activity className="w-6 h-6 animate-spin" /> Processing Data...
                            </>
                        ) : (
                            <>
                                Run Diagnostic Analysis <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-500/20 border border-red-500/50 text-red-100 rounded-xl text-center font-medium flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <AlertCircle className="w-5 h-5" /> {error}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
