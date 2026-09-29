import React, { useState } from "react";
import { MapPin, Phone, Ticket, CheckCircle2, Clock, ShieldCheck, Sparkles, X } from "lucide-react";

export default function CscAssistanceCard({ userDistrict = "Samastipur", userState = "Bihar" }) {
  const [tokenBooked, setTokenBooked] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const handleBookToken = () => {
    setTokenBooked(true);
    setTimeout(() => setTokenBooked(false), 8000);
  };

  return (
    <div className="space-y-4">
      {/* CSC Facilitation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                निकटतम जन सेवा केंद्र (CSC)
              </h3>
              <p className="text-[10px] text-slate-500">Local e-Gov Assistance Center</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            1.2 km
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Simulated Mini Map Banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-3.5 text-white">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold flex items-center text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-orange-400 mr-1" />
                {userDistrict} CSC e-Gov Hub
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                खुला है (Open till 7 PM)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
              <span>Token Wait: ~15 mins</span>
              <span className="text-amber-300 font-semibold">4 VLE Desks Active</span>
            </div>
          </div>

          {/* VLE Operator Details */}
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              RS
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Ramesh Sharma (VLE)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                  Top Rated
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Govt Certified Assistant • CSC #9821
              </p>
            </div>
          </div>

          {tokenBooked && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">टोकन बुक हो गया! Token #A-42</p>
                <p className="text-[11px] text-emerald-700">कृपया 20 मिनट के भीतर केंद्र पर पहुंचें।</p>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowCallModal(true)}
              type="button"
              className="inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              कॉल करें (Call)
            </button>
            <button
              onClick={handleBookToken}
              type="button"
              className="inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs"
            >
              <Ticket className="w-3.5 h-3.5 mr-1.5" />
              बुक टोकन (Token)
            </button>
          </div>
        </div>
      </div>

      {/* Today's Civic Tip */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-start space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 flex items-center">
              आज का सुझाव (Today's Civic Tip)
            </h4>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
              पीएम किसान लाभार्थी अपना आधार बायो-मैट्रिक ई-केवाईसी समय पर पूर्ण करा लें ताकि आगामी किस्त बिना किसी रुकावट के सीधे बैंक खाते में जमा हो सके।
            </p>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">जन सेवा केंद्र संपर्क</h3>
              <p className="text-xs text-slate-500 mt-1">CSC VLE Assistant Helpline</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-sm font-mono font-bold text-slate-800 border border-slate-200">
              +91 98210 44812
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              समय: प्रातः 9:00 AM से सायं 7:00 PM तक (सोमवार - शनिवार)
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setShowCallModal(false)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
