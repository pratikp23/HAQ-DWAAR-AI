import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getSchemeById } from "../../services/schemeApi";
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  FileCheck2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building, 
  HelpCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export default function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSchemeById(id);
        setScheme(res?.data?.scheme);
      } catch (err) {
        setError(err.message || "Failed to load scheme details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-3 text-slate-600">
        <RefreshCw className="w-8 h-8 text-blue-700 animate-spin" />
        <p className="text-sm font-medium">Loading verified scheme specifications...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center space-y-4">
        <div className="max-w-md w-full bg-white p-6 rounded-xl border border-red-200 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Scheme Unavailable</h2>
          <p className="text-xs text-slate-600">{error || "The requested scheme could not be found."}</p>
          <Link
            to="/dashboard/schemes"
            className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
          >
            ← Back to Schemes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/dashboard/schemes"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Schemes
          </Link>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Official Source
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Title Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
              {scheme.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              State: {scheme.state}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Mode: {scheme.applicationMethod}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scheme.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {scheme.fullDescription || scheme.shortDescription}
          </p>

          {/* Benefit Highlight Box */}
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-sm space-y-1">
            <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider">
              Official Benefit Summary
            </span>
            <p className="text-blue-900 font-medium leading-relaxed">{scheme.benefitSummary}</p>
          </div>
        </div>

        {/* Eligibility Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Eligibility Criteria</h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {scheme.eligibilitySummary}
          </p>

          {scheme.rules && scheme.rules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Structured Criteria Checks:</span>
              <ul className="space-y-2 text-xs">
                {scheme.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rule.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Required Documents */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base">Required Documents</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {scheme.requiredDocuments?.map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{doc.documentType}</span>
                  {doc.mandatory && (
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Mandatory
                    </span>
                  )}
                </div>
                {doc.guidance && <p className="text-slate-500 text-[11px]">{doc.guidance}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Official Source & Verification Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-base">Official Government Source</h2>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong className="text-slate-800">Source Authority:</strong> {scheme.sourceName}
            </p>
            <p>
              <strong className="text-slate-800">Source Type:</strong> {scheme.sourceType?.replace("_", " ")}
            </p>
            <p>
              <strong className="text-slate-800">Last Verified Date:</strong>{" "}
              {scheme.sourceLastVerified ? new Date(scheme.sourceLastVerified).toLocaleDateString() : "Verified"}
            </p>
            <p className="pt-1">
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center"
              >
                View Official Notification / Guidelines <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </p>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base">Ready to Apply?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              HaqDwaar provides navigation and document readiness. Applications must be completed directly on the official government portal.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {scheme.officialApplicationUrl ? (
              <a
                href={scheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Visit Official Application Portal <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            ) : (
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Visit Official Source Portal <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
