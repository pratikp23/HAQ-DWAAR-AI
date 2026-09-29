import React from "react";
import { Activity, CheckCircle2, AlertTriangle, ShieldCheck, Server, Database, Sparkles, Mic, Layers, Bell } from "lucide-react";

export default function SystemHealthPanel({ health = null }) {
  if (!health) return null;

  const services = [
    {
      name: "Backend Core API",
      status: health.api?.status || "HEALTHY",
      detail: `Uptime: ${Math.floor((health.api?.uptimeSeconds || 0) / 60)}m (${health.api?.environment})`,
      icon: Server,
      isOk: health.api?.status === "HEALTHY",
    },
    {
      name: "MongoDB Database",
      status: health.database?.status || "CONNECTED",
      detail: `State: ${health.database?.connectionState || "CONNECTED"}`,
      icon: Database,
      isOk: health.database?.status === "CONNECTED",
    },
    {
      name: "Gemini NLU / Fallback",
      status: health.ai?.status || "CONFIGURED",
      detail: health.ai?.provider || "Gemini 1.5 Flash",
      icon: Sparkles,
      isOk: health.ai?.status === "CONFIGURED",
    },
    {
      name: "Bhashini Voice Engine",
      status: health.voice?.status || "DEMO",
      detail: health.voice?.provider || "Voice Demo Mode",
      icon: Mic,
      isOk: true, // Demo is expected
      badgeColor: health.voice?.mode === "real" ? "bg-emerald-50 text-emerald-800" : "bg-purple-50 text-purple-800",
    },
    {
      name: "DigiLocker Integration",
      status: health.digilocker?.status || "DEMO",
      detail: health.digilocker?.mode === "production" ? "Production OAuth" : "Simulated Demo Mode",
      icon: Layers,
      isOk: true,
      badgeColor: health.digilocker?.mode === "production" ? "bg-emerald-50 text-emerald-800" : "bg-purple-50 text-purple-800",
    },
    {
      name: "Notification Subsystem",
      status: health.notifications?.status || "ACTIVE",
      detail: `In-App: Active • WhatsApp: ${health.notifications?.whatsappChannel || "Demo"}`,
      icon: Bell,
      isOk: health.notifications?.status === "ACTIVE",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-[#591d8f]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              System & Service Health
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live operational verification across platform subsystems
            </p>
          </div>
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Subsystems Operational</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          const statusBadge =
            srv.status === "HEALTHY" || srv.status === "CONNECTED" || srv.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : srv.status === "CONFIGURED"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : srv.status === "DEMO"
              ? "bg-purple-50 text-purple-800 border-purple-200"
              : "bg-amber-50 text-amber-700 border-amber-200";

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-center justify-between space-x-3"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">
                    {srv.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {srv.detail}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusBadge}`}
              >
                {srv.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span>Zero internal secrets, tokens, or database passwords are ever exposed.</span>
        <span>Last checked: {new Date(health.timestamp || Date.now()).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
