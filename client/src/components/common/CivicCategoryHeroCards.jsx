import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import Avatar from "./Avatar";

/**
 * HAQ DWAAR AI — Civic Category Hero Cards
 * Implemented using the exact HeroUI Card compound component specification:
 * https://heroui.com/en/docs/react/components/card#with-images
 * 
 * Small, clean, high-density cards containing complete information:
 * - 56x56 aspect-square w-14 rounded-2xl image
 * - Scheme count badge
 * - Card.Header with Card.Title and Card.Description
 * - Card.Footer with Avatar (Image + Fallback) and Ministry Byline
 */
export default function CivicCategoryHeroCards() {
  const categories = [
    {
      id: "KISAN",
      title: "Agriculture & Kisan",
      schemesCount: "32+ Schemes",
      benefitHighlight: "₹6,000/yr DBT • Inputs",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "AG",
      byline: "By Min. of Agriculture",
      route: "/browse-schemes?category=KISAN",
    },
    {
      id: "STUDENT",
      title: "Student Scholarships",
      schemesCount: "48+ Schemes",
      benefitHighlight: "100% Tuition • Merit",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "ED",
      byline: "By NSP & DoSEL",
      route: "/browse-schemes?category=STUDENT",
    },
    {
      id: "HEALTH",
      title: "Ayushman Healthcare",
      schemesCount: "18+ Schemes",
      benefitHighlight: "₹5,00,000 Cashless Care",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "PM",
      byline: "By National Health Auth",
      route: "/browse-schemes?category=HEALTH",
    },
    {
      id: "HOUSING",
      title: "Affordable Housing",
      schemesCount: "14+ Schemes",
      benefitHighlight: "₹1.2L - ₹2.5L Grant",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "PM",
      byline: "By MoHUA & MoRD",
      route: "/browse-schemes?category=HOUSING",
    },
    {
      id: "WOMEN",
      title: "Women & Motherhood",
      schemesCount: "24+ Schemes",
      benefitHighlight: "Maternity • ₹5,000 Cash",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "WC",
      byline: "By Min. of Women & Child",
      route: "/browse-schemes?category=WOMEN",
    },
    {
      id: "BUSINESS",
      title: "MSME & Micro Credit",
      schemesCount: "21+ Schemes",
      benefitHighlight: "35% Subsidy • Mudra",
      image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "MS",
      byline: "By KVIC & MSME Min.",
      route: "/browse-schemes?category=BUSINESS",
    },
    {
      id: "GENERAL",
      title: "Social Security",
      schemesCount: "19+ Schemes",
      benefitHighlight: "Guaranteed APY Pension",
      image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=200&auto=format&fit=crop&q=80",
      avatarSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
      avatarFallback: "SS",
      byline: "By MoSJE & PFRDA",
      route: "/browse-schemes?category=GENERAL",
    },
  ];

  return (
    <div className="w-full">
      {/* Scrollable Container with Unstop-style horizontal flow */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar snap-x">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.route}
            className="shrink-0 snap-start focus:outline-none group"
          >
            {/* Exact HeroUI Card Spec: w-[185px] sm:w-[195px] gap-2 */}
            <Card className="w-[185px] sm:w-[195px] h-full gap-2 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col justify-between">
              
              {/* Top Row: 56x56 Rounded Image + Schemes Count Chip */}
              <div className="flex items-center justify-between gap-2">
                <img
                  alt={cat.title}
                  className="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  src={cat.image}
                />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                  {cat.schemesCount}
                </span>
              </div>

              {/* Card Header (Title & Description) */}
              <Card.Header className="p-0 border-none gap-0.5">
                <Card.Title className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                  {cat.title}
                </Card.Title>
                <Card.Description className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {cat.benefitHighlight}
                </Card.Description>
              </Card.Header>

              {/* Card Footer: Avatar + Ministry Byline */}
              <Card.Footer className="flex items-center gap-1.5 p-0 border-none pt-2 border-t border-slate-100">
                <Avatar aria-label={cat.byline} className="w-5 h-5 shrink-0 bg-slate-100 border border-slate-200">
                  <Avatar.Image
                    alt={cat.byline}
                    src={cat.avatarSrc}
                  />
                  <Avatar.Fallback className="text-[9px] font-black text-slate-700">
                    {cat.avatarFallback}
                  </Avatar.Fallback>
                </Avatar>
                <span className="text-[10px] font-medium text-slate-500 truncate group-hover:text-slate-800 transition-colors">
                  {cat.byline}
                </span>
              </Card.Footer>

            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
