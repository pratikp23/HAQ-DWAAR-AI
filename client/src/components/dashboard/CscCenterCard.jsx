import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Ticket,
  CheckCircle2,
  Navigation,
  Star,
  ShieldCheck,
  Calendar,
  X,
  ExternalLink,
  Printer,
  Maximize2,
  Image as ImageIcon,
  Compass,
  Layers,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function CscCenterCard({ user, profileData }) {
  const { language } = useLanguage();

  const district = profileData?.personal?.district || profileData?.location?.district || "Jabalpur";
  const state = profileData?.personal?.state || profileData?.location?.state || "Madhya Pradesh";
  const citizenName = profileData?.personal?.fullName || user?.name || "Citizen";

  // Active view tab inside the card map container
  const [activeView, setActiveView] = useState("map"); // 'map', 'satellite', 'photos'
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Modals
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);

  // Pinned location queries
  const locationQuery = `${district} CSC e-Gov Hub Civil Lines ${district} ${state}`;
  const googleMapNormalUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapSatelliteUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=k&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery)}`;

  // Photos of the Center
  const centerPhotos = [
    {
      title: `${district} CSC Digital Seva Kendra (Front View)`,
      subtitle: "Civil Lines Main Road • Authorised e-Gov Centre",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Biometric & Aadhaar Update Counter",
      subtitle: "Dedicated Iris & Fingerprint scanner desk",
      url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Citizen Helpdesk & Fast-Track Token Entry",
      subtitle: "Official VLE Operator Consultation Desk",
      url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Token form state
  const [selectedService, setSelectedService] = useState("Kisan e-KYC & DBT Link");
  const [selectedSlot, setSelectedSlot] = useState("Today, 03:30 PM");

  const services = [
    "Kisan e-KYC & DBT Bank Seeding",
    "Income & Domicile Certificate Online Apply",
    "Student Scholarship Portal Form Verification",
    "Aadhaar Demographic Update & Biometrics",
    "PM Awas Yojana Document Upload",
  ];

  const timeSlots = [
    "Today, 03:30 PM (~10 min wait)",
    "Today, 05:00 PM (~5 min wait)",
    "Tomorrow, 11:00 AM (Fresh Morning Slot)",
    "Tomorrow, 02:30 PM (Afternoon)",
  ];

  const handleBookToken = (e) => {
    e.preventDefault();
    const tokenNumber = `CSC-${district.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setBookedToken({
      tokenNumber,
      service: selectedService,
      slot: selectedSlot,
      centerName: `${district} CSC e-Gov Hub`,
      vleName: "Rajesh Soni (CSC VLE ID: 482910)",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    });
  };

  return (
    <>
      {/* CSC Assistance Card with Directly Visible Google Map */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 rounded-3xl border border-orange-200/90 p-5 sm:p-6 shadow-xs space-y-5 hover:border-orange-300 transition-all">
        
        {/* Top Header & Distance Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-2xs">
                {language === "en" ? "Nearest CSC Center" : "निकटतम जन सेवा केंद्र (CSC)"}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                {language === "en" ? "Open today till 7 PM" : "खुला है (आज 7:00 PM तक)"}
              </span>
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-600" />
                Google Maps Verified
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{district} CSC e-Gov Hub</span>
            </h3>
            
            <p className="text-xs text-slate-600 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Civil Lines, Near Tehsil Office / Collectorate, {district}, {state}</span>
            </p>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-orange-100 border border-orange-200 text-orange-800 text-xs font-black shadow-2xs">
              <Navigation className="w-3.5 h-3.5 text-orange-600" />
              <span>1.2 km away</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">
              Token Wait: <span className="text-emerald-700 font-bold">~10 mins</span>
            </div>
          </div>
        </div>

        {/* GOOGLE MAP & CENTER PHOTOS DIRECT CONTAINER */}
        <div className="rounded-2xl border-2 border-orange-200/80 bg-white overflow-hidden shadow-sm">
          
          {/* Map Top Bar with Google Branding & View Switcher */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-[#1e0a3c] to-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
            
            {/* Google Maps Header & Pinned Tag */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-rose-400 fill-rose-500" />
              </div>
              <div>
                <div className="text-xs font-extrabold flex items-center gap-1.5">
                  <span className="text-amber-300">Google Maps</span>
                  <span className="text-slate-400">•</span>
                  <span>{district} Pinned Center</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  Exact GPS Coordinates • Civil Lines Center
                </div>
              </div>
            </div>

            {/* View Switcher Tabs (Normal Map, Satellite, Photos) */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-xs">
              <button
                id="step-csc-map-btn"
                type="button"
                onClick={() => setActiveView("map")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeView === "map"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Map</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("satellite")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeView === "satellite"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Satellite</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("photos")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeView === "photos"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photos ({centerPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMapModalOpen(true)}
                className="p-1 rounded-lg text-slate-200 hover:text-white hover:bg-white/20 transition cursor-pointer ml-0.5"
                title="Open Fullscreen Map"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE DISPLAY AREA */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-100">
            
            {/* VIEW 1: NORMAL GOOGLE MAP */}
            {activeView === "map" && (
              <div className="w-full h-full relative">
                <iframe
                  title={`${district} Google Map Pinned Location`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={googleMapNormalUrl}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                />

                {/* Floating Google Marker Overlay Badge */}
                <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 leading-tight">
                      {district} CSC e-Gov Hub
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>📍 Pinned Center • 1.2 km away</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: SATELLITE GOOGLE MAP */}
            {activeView === "satellite" && (
              <div className="w-full h-full relative">
                <iframe
                  title={`${district} Google Map Satellite View`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={googleMapSatelliteUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />

                {/* Satellite mode floating badge */}
                <div className="absolute top-3 left-3 z-10 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Earth &amp; Satellite View</span>
                </div>
              </div>
            )}

            {/* VIEW 3: CENTER PHOTOS GALLERY */}
            {activeView === "photos" && (
              <div className="w-full h-full relative bg-slate-950 flex flex-col justify-between">
                <img
                  src={centerPhotos[activePhotoIdx].url}
                  alt={centerPhotos[activePhotoIdx].title}
                  className="w-full h-full object-cover opacity-90 transition duration-500"
                />
                
                {/* Photo Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 text-white flex items-end justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3 h-3" />
                      <span>Verified Kendra Photo</span>
                    </div>
                    <h4 className="text-sm font-bold">{centerPhotos[activePhotoIdx].title}</h4>
                    <p className="text-[11px] text-slate-300">{centerPhotos[activePhotoIdx].subtitle}</p>
                  </div>

                  {/* Thumbnail selectors */}
                  <div className="flex gap-1.5">
                    {centerPhotos.map((photo, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setActivePhotoIdx(pIdx)}
                        className={`w-10 h-7 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                          activePhotoIdx === pIdx ? "border-amber-400 scale-105" : "border-white/40 opacity-70"
                        }`}
                      >
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Route & Directions Banner */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                🚗 4 min via Civil Lines Rd
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                🚶 14 min walk
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-orange-700 font-semibold hidden sm:inline">
                Near Tehsil Office Gate #2
              </span>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps Directions</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>

        </div>

        {/* VLE Operator Credentials Box */}
        <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-100/80 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1e0a3c] to-[#ea580c] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              VLE
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 flex items-center space-x-1.5">
                <span>CSC VLE Operator</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Govt Certified
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Rajesh Soni • Assistant CSC-VLE • Biometrics &amp; Form Specialist
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 text-amber-800 text-xs font-black shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9</span>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="step-csc-call-btn"
            type="button"
            onClick={() => setCallModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "en" ? "Call Center (+91 1800-3000-3468)" : "कॉल करें (Call Center)"}</span>
          </button>

          <button
            id="step-csc-token-btn"
            type="button"
            onClick={() => setTokenModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-orange-700 text-white shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 text-white" />
            <span>{language === "en" ? "Book Fast-Track Token" : "बुक टोकन (Fast-Track Token)"}</span>
          </button>
        </div>

      </div>

      {/* MODAL 1: Full-Screen Interactive Pinned Map Modal */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 my-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-black text-slate-900">
                      {district} CSC e-Gov Hub on Google Maps
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Pinned 📍
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Civil Lines, Near Tehsil Office, {district}, {state}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Res Map Embed */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title={`${district} CSC Center Pinned Location Full`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={googleMapNormalUrl}
                className="w-full h-full border-0 filter contrast-105"
                loading="lazy"
              />

              {/* Floating Center Badge */}
              <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-orange-200 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md animate-bounce">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {district} CSC e-Gov Hub
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>1.2 km • ~4 min travel time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info and Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
                <div className="font-bold text-slate-800">
                  Landmark: Near Tehsil Office &amp; Collectorate
                </div>
                <div className="text-[11px] text-slate-500">
                  Open today 9:30 AM – 7:00 PM • Average token wait: 10 mins
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMapModalOpen(false);
                    setTokenModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-orange-700 text-white shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book Token</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Book Fast-Track CSC Token */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                  MeitY Authorized CSC
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {district} CSC Seva Kendra Token
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTokenModalOpen(false);
                  setBookedToken(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!bookedToken ? (
              <form onSubmit={handleBookToken} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Citizen Name</label>
                  <input
                    type="text"
                    value={citizenName}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Required Service / सेवा चुनें</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {services.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Appointment Slot / समय चुनें</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/80 text-[11px] text-orange-950 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                    <span>Zero Middlemen Guarantee</span>
                  </div>
                  <p>All CSC services are provided strictly as per official government prescribed fees. Token guarantees fast-track queue entry.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-orange-700 text-white shadow-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Fast-Track Token</span>
                </button>
              </form>
            ) : (
              /* Generated Token Slip */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-orange-50 border-2 border-dashed border-emerald-400 text-center space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-600 text-white">
                    Token Confirmed • टोकन जारी
                  </div>

                  <div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                      {bookedToken.tokenNumber}
                    </div>
                    <div className="text-xs font-bold text-emerald-800 mt-0.5">
                      {bookedToken.service}
                    </div>
                  </div>

                  <div className="text-left text-xs bg-white/90 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Citizen:</span>
                      <span className="font-bold text-slate-800">{citizenName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheduled Time:</span>
                      <span className="font-bold text-orange-700">{bookedToken.slot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Center:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">{bookedToken.centerName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Token</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTokenModalOpen(false);
                      setBookedToken(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#240b49] hover:bg-purple-950 text-white cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Call VLE Operator */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 text-center shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-sm text-slate-900">
                Call {district} CSC e-Gov Hub
              </h3>
              <p className="text-xs text-slate-500">
                Connect directly with certified VLE operator for scheme assistance or document queries.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Official Toll-Free / Desk No:</div>
              <div className="text-lg font-black text-slate-900 font-mono">+91 1800-3000-3468</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Toll-free • 9:30 AM to 7:00 PM</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCallModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
              <a
                href="tel:180030003468"
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
