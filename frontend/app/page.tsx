"use client";

import Link from "next/link";
import { Stethoscope, Activity, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import LiveBackground from "@/components/LiveBackground";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0d47a1] to-[#1976d2] text-white overflow-hidden pb-20 pt-12 md:pt-20 px-6 md:px-12 min-h-[90vh] flex items-center">

        {/* Live Background */}
        <div className="absolute inset-0 opacity-40">
          <LiveBackground />
        </div>

        {/* Background Gradient & Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0a2472]/50 to-[#0a2472] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgb(255,255,255)" }}
              className="text-4xl md:text-6xl font-bold leading-tight cursor-default"
            >
              Rural Clinical <br />
              <motion.span
                initial={{ opacity: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="inline-block bg-[linear-gradient(110deg,#93c5fd,45%,#ffffff,55%,#93c5fd)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer"
              >
                AI Assistant
              </motion.span>
            </motion.h1>
            <motion.h2
              whileHover={{ x: 5, color: "#FFFFFF" }}
              className="text-xl md:text-2xl text-blue-100 font-light leading-relaxed max-w-lg cursor-default"
            >
              Expert-driven medical records and insights streamlining the entire care workflow.
            </motion.h2>

            <div className="pt-4 flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/browse" className="bg-white text-[#0d47a1] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg">
                  Start Analysis <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full font-medium text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-8">
              <motion.div whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }} className="cursor-pointer">
                <div className="text-3xl font-bold text-blue-200">5k+</div>
                <div className="text-xs text-blue-100 uppercase tracking-wide mt-1">Conditions</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }} className="cursor-pointer">
                <div className="text-3xl font-bold text-blue-200">94%</div>
                <div className="text-xs text-blue-100 uppercase tracking-wide mt-1">Accuracy</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }} className="cursor-pointer">
                <div className="text-3xl font-bold text-blue-200">24/7</div>
                <div className="text-xs text-blue-100 uppercase tracking-wide mt-1">Availability</div>
              </motion.div>
            </div>

          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Abstract UI composition */}
            <div className="relative w-full h-[500px]">
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

              {/* Floating Card 1 */}
              <motion.div
                whileHover={{ scale: 1.1, x: 10, rotate: 0 }}
                className="absolute top-10 right-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl w-64 transform rotate-3 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold text-sm">Vitals Monitor</span>
                  <span className="text-green-400 text-xs px-2 py-0.5 bg-green-400/20 rounded-full">Stable</span>
                </div>
                <div className="flex gap-4 text-xs text-blue-100">
                  <div>
                    <div className="text-[10px] text-blue-300 uppercase">HR</div>
                    <div className="text-lg font-mono">72 <span className="text-[10px]">bpm</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-300 uppercase">SpO2</div>
                    <div className="text-lg font-mono">98 <span className="text-[10px]">%</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 (Center) */}
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="absolute top-1/4 left-10 z-30 bg-white p-6 rounded-2xl shadow-2xl w-80 text-blue-900 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full"><Stethoscope className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <div className="font-bold">Clinical Insight</div>
                    <div className="text-xs text-slate-400">AI Generated</div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02, color: "#1e3a8a" }}
                  className="space-y-2 text-sm text-slate-600 leading-relaxed font-medium cursor-default"
                >
                  <p>Patient exhibits signs of early-stage dermatitis. Recommended protocol includes topical corticosteroids and allergen avoidance.</p>
                </motion.div>
                <div className="mt-4 flex gap-2">
                  <div className="h-8 w-20 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Action</div>
                  <div className="h-8 w-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 text-xs font-bold">Ignore</div>
                </div>
              </motion.div>

              {/* Floating Card 3 - Live ECG */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="absolute bottom-20 right-20 z-10 bg-[#002171] p-4 rounded-xl shadow-xl w-60 border border-white/10 transform -rotate-3 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2 z-20 relative">
                  <span className="text-xs font-mono text-blue-300 font-bold">LIVE ECG</span>
                  <div className="flex gap-1 items-center">
                    <span className="text-[10px] text-green-400">80 BPM</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                  </div>
                </div>

                {/* Grid Background */}
                <div className="h-16 bg-blue-900/40 rounded-lg relative overflow-hidden flex items-center border border-white/5">
                  <div className="absolute inset-0 z-0 opacity-20" style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                  }}></div>

                  {/* ECG Line */}
                  <div className="absolute inset-0 z-10 flex items-center w-[200%]">
                    <svg viewBox="0 0 600 100" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="5%" stopColor="#4ade80" />
                          <stop offset="95%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M0,50 L20,50 L30,20 L40,80 L50,50 L80,50 L90,20 L100,80 L110,50 L140,50 L150,20 L160,80 L170,50 L200,50 L210,20 L220,80 L230,50 L260,50 L270,20 L280,80 L290,50 L320,50 M320,50 L340,50 L350,20 L360,80 L370,50 L400,50 L410,20 L420,80 L430,50 L460,50 L470,20 L480,80 L490,50 L520,50 L530,20 L540,80 L550,50 L580,50 L590,20 L600,80 L610,50 L640,50"
                        fill="none"
                        stroke="url(#line-gradient)"
                        strokeWidth="2"
                        initial={{ x: 0 }}
                        animate={{ x: -320 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* Decorative Wave/Curve at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white opacity-20"></path>
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white opacity-40"></path>
          </svg>
        </div>

      </section >

    </main >
  );
}
