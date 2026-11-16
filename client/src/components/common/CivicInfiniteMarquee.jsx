import React from "react";
import {
  DigiLockerBrandLogo,
  BhashiniBrandLogo,
  DbtBharatBrandLogo,
  IndiaStackBrandLogo,
  UmangBrandLogo,
  PfmsBrandLogo,
  AgricultureMinBrandLogo,
  HealthMinBrandLogo,
  EducationMinBrandLogo,
  LabourMinBrandLogo,
  MsmeMinBrandLogo,
  SocialJusticeBrandLogo,
} from "./OfficialLogos";

/**
 * 12 Curated National Public Rails & Portals with Authentic Vector Logos
 * Zero nested divs inside the logo item — exactly matching the Unstop reference
 */
const CIVIC_ENTITIES = [
  {
    id: "digilocker",
    name: "DigiLocker",
    LogoComponent: DigiLockerBrandLogo,
  },
  {
    id: "agri-min",
    name: "Min. of Agriculture & Farmers Welfare",
    LogoComponent: AgricultureMinBrandLogo,
  },
  {
    id: "bhashini",
    name: "BHASHINI AI",
    LogoComponent: BhashiniBrandLogo,
  },
  {
    id: "social-justice",
    name: "Min. of Social Justice & Empowerment",
    LogoComponent: SocialJusticeBrandLogo,
  },
  {
    id: "dbt-bharat",
    name: "DBT Bharat",
    LogoComponent: DbtBharatBrandLogo,
  },
  {
    id: "edu-min",
    name: "Ministry of Education",
    LogoComponent: EducationMinBrandLogo,
  },
  {
    id: "indiastack",
    name: "IndiaStack",
    LogoComponent: IndiaStackBrandLogo,
  },
  {
    id: "labour-min",
    name: "Ministry of Labour & Employment",
    LogoComponent: LabourMinBrandLogo,
  },
  {
    id: "umang",
    name: "UMANG Unified Platform",
    LogoComponent: UmangBrandLogo,
  },
  {
    id: "msme-min",
    name: "Ministry of MSME",
    LogoComponent: MsmeMinBrandLogo,
  },
  {
    id: "pfms",
    name: "PFMS Network",
    LogoComponent: PfmsBrandLogo,
  },
  {
    id: "health-min",
    name: "Ministry of Health & Family Welfare",
    LogoComponent: HealthMinBrandLogo,
  },
];

export default function CivicInfiniteMarquee() {
  const renderLogoGroup = (groupKey) => (
    <div
      key={groupKey}
      className="flex shrink-0 justify-around gap-[var(--gap,1rem)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
    >
      {CIVIC_ENTITIES.map((item, idx) => {
        const Logo = item.LogoComponent;
        return (
          <div
            key={`${groupKey}-${item.id}-${idx}`}
            className="mx-8 sm:mx-10 flex items-center justify-center h-12 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0 cursor-pointer select-none"
            title={item.name}
          >
            <Logo className="max-h-full max-w-[170px] w-auto h-10 object-contain" />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-1">
      {/* Magic UI / Unstop Marquee Container */}
      <div className="group flex gap-[var(--gap,1rem)] overflow-hidden p-2 [--gap:1rem] flex-row [--duration:50s] w-full">
        {renderLogoGroup("track-1")}
        {renderLogoGroup("track-2")}
        {renderLogoGroup("track-3")}
        {renderLogoGroup("track-4")}
      </div>

      {/* Left Gradient Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-page via-page/80 to-transparent z-10" />

      {/* Right Gradient Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-page via-page/80 to-transparent z-10" />
    </div>
  );
}
