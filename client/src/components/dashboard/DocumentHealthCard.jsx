import React from "react";
import { Link } from "react-router-dom";
import { 
  FolderCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Download,
  RefreshCw,
  FileText,
  BadgeCheck,
  CreditCard,
  Building2,
  GraduationCap
} from "lucide-react";
import { DigiLockerLogo, AadhaarLogo } from "../common/GovLogos";

/**
 * HAQ DWAAR AI — Document Health Card ("DigiLocker Vault Health")
 * 
 * Redesigned for high-trust, human civic feel:
 * - Clear DigiLocker connectivity status & Direct API v3 badge
 * - 3-pill health overview counter (Verified, Action Required, Pending Fetch)
 * - Authentic civic document rows with real authority references
 * - Interactive action chips (Fetch DigiLocker, Re-apply)
 * - Clear, readable typography and comfortable line heights
 */
export default function DocumentHealthCard({
  documents = [],
  isDemoMode = true,
  loading = false,
  error = null,
}) {
  const defaultMockRows = [
    { 
      id: "doc-1",
      name: "Aadhaar Card (UIDAI Verified)", 
      authority: "UIDAI •••• 9912 • e-KYC Active", 
      status: "Verified", 
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: CreditCard,
      iconColor: "text-emerald-700 bg-emerald-100/70",
      actionText: "View",
      isAction: false
    },
    { 
      id: "doc-2",
      name: "NFSA Ration Card (PHH Beneficiary)", 
      authority: "State Food Dept. • RC-8821094 • Active", 
      status: "Verified", 
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: Building2,
      iconColor: "text-emerald-700 bg-emerald-100/70",
      actionText: "View",
      isAction: false
    },
    { 
      id: "doc-4",
      name: "Annual Income Certificate (आय प्रमाण पत्र)", 
      authority: "Issued 2022 • Expired (Validity: 1 Year)", 
      status: "Re-apply", 
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      icon: AlertTriangle,
      iconColor: "text-rose-700 bg-rose-100/70",
      actionText: "Re-apply",
      isAction: true,
      actionTo: "/dashboard/documents"
    },
    { 
      id: "doc-5",
      name: "Land Record / Khatauni (खतौनी)", 
      authority: "Revenue Dept. • Khata #492 Pending Sync", 
      status: "Fetch", 
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: RefreshCw,
      iconColor: "text-amber-700 bg-amber-100/70",
      actionText: "Fetch",
      isAction: true,
      actionTo: "/dashboard/documents"
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3">
      
      {/* 1. Header: Title, API Status & Connection */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <DigiLockerLogo className="w-6 h-6 shadow-2xs" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-normal">
                DigiLocker Vault Health
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              दस्तावेज़ स्वास्थ्य • 3 of 4 Required Documents Verified
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct API v3</span>
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-purple-50 text-[#591d8f] border border-purple-200">
              {isDemoMode ? "DigiLocker Demo" : "Sync Active"}
            </span>
          </div>
        </div>

        {/* 2. Three Quick Status Counter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px]">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>2 Verified in Vault</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>1 Needs Renewal</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>1 Pending Fetch</span>
          </span>
        </div>

        {/* 3. Document Health Rows */}
        <div className="space-y-1.5 pt-0.5">
          {defaultMockRows.map((doc) => {
            const IconComp = doc.icon;
            return (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 transition-colors text-xs gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${doc.iconColor}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500 font-normal truncate">
                      {doc.authority}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${doc.badgeColor}`}>
                    {doc.status}
                  </span>
                  {doc.isAction && (
                    <Link
                      to={doc.actionTo || "/dashboard/documents"}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-2xs transition-colors"
                    >
                      {doc.actionText}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Trust Notice */}
        <p className="text-xs text-slate-500 font-normal leading-normal flex items-center gap-1.5 pt-0.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            DigiLocker documents verified against issuing authority records. No physical verification needed.
          </span>
        </p>
      </div>

      {/* 5. Clear Full-Width CTA */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to="/dashboard/documents"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>Open DigiLocker Document Vault</span>
          <ArrowRight className="w-4 h-4 text-orange-400" />
        </Link>
      </div>

    </div>
  );
}
