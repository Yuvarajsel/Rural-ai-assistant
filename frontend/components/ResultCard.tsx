"use client";
import { AlertTriangle, CheckCircle, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";


interface ResultCardProps {
    result: {
        probable_condition: string;
        disease_stage: string;
        risk_level: string;
        detailed_explanation: string;
        treatment_guidance: string;
        medications: string[];
        patient_dos: string[];
        patient_donts: string[];
        referral_recommendation: string;
    } | null;
    loading: boolean;
}

export default function ResultCard({ result, loading }: ResultCardProps) {
    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-100 shadow-lg">
                <div className="flex justify-center mb-4">
                    <Activity className="w-10 h-10 text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Analyzing Clinical Data...</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                    Comparing inputs against 5,000+ medical guidelines.
                </p>
            </div>
        );
    }

    if (!result) return null;

    const isHighRisk = result.risk_level.toLowerCase().includes("high") || result.risk_level.toLowerCase().includes("emergency");
    const isModerateRisk = result.risk_level.toLowerCase().includes("moderate");

    return (
        <div className="space-y-6">
            {/* 1. Insight Banner */}
            <div className={cn(
                "rounded-xl border p-6 flex items-start gap-4 shadow-sm",
                isHighRisk ? "bg-red-50 border-red-100" : isModerateRisk ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
            )}>
                <div className={cn("p-2 rounded-full", isHighRisk ? "bg-red-100" : isModerateRisk ? "bg-amber-100" : "bg-emerald-100")}>
                    {isHighRisk ? <AlertTriangle className="text-red-600 w-6 h-6" /> : <CheckCircle className="text-emerald-600 w-6 h-6" />}
                </div>
                <div>
                    <h2 className={cn("text-xl font-bold mb-1", isHighRisk ? "text-red-900" : isModerateRisk ? "text-amber-900" : "text-emerald-900")}>
                        {result.probable_condition}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded", isHighRisk ? "bg-red-200 text-red-800" : "bg-emerald-200 text-emerald-800")}>
                            {result.risk_level}
                        </span>
                        <span className="text-sm font-medium text-slate-600">
                            • Stage: {result.disease_stage}
                        </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">
                        {result.detailed_explanation}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2. Medication & Treatment */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Info className="w-4 h-4" /></div>
                        <h3 className="font-bold text-slate-900">Treatment Plan</h3>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medications</h4>
                        <ul className="space-y-2">
                            {result.medications.map((med, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                    {med}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Guidance</h4>
                        <p className="text-sm text-slate-600">{result.treatment_guidance}</p>
                    </div>
                </div>

                {/* 3. Patient Instructions (Do's & Don'ts) */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <div className="bg-purple-100 p-1.5 rounded text-purple-600"><Activity className="w-4 h-4" /></div>
                        <h3 className="font-bold text-slate-900">Patient Care Instructions</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> What to Do
                            </h4>
                            <ul className="space-y-1">
                                {result.patient_dos.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                        <span className="text-emerald-500 font-bold">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> What NOT to Do
                            </h4>
                            <ul className="space-y-1">
                                {result.patient_donts.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                        <span className="text-red-400 font-bold">✕</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Referral / Footer */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="bg-slate-200 p-2 rounded-full text-slate-600">
                    <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">Next Step Recommendation</h4>
                    <p className="text-sm text-slate-600">{result.referral_recommendation}</p>
                </div>
            </div>
        </div>
    );
}
