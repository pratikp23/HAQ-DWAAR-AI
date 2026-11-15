/**
 * LOK SAMARTH — Authentic Statutory Schemes Catalog
 * 
 * Direct read-only baseline of official Government of India and State Welfare Schemes.
 * Integrated with DBT (Direct Benefit Transfer), DigiLocker certificate types, and ministerial gazettes.
 */

export const STATUTORY_SCHEMES = [
  // ========================================================
  // 1. STUDENTS & HIGHER EDUCATION (STUDENT)
  // ========================================================
  {
    _id: "scheme-nsp-csss",
    name: "Central Sector Scheme of Scholarship for College and University Students (PM-USP)",
    shortDescription: "Merit-cum-means financial scholarship for college and university students to meet academic and maintenance expenses during degree programs.",
    fullDescription: "Implemented by the Department of Higher Education, Ministry of Education. Provides direct bank transfers to regular undergraduate and postgraduate students based on Class 12 board examination percentile (above 80th percentile).",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["Undergraduate Students", "B.Tech Scholars", "College Freshers"],
    benefitSummary: "₹20,000 / Year Direct DBT (₹12,000 at UG level, ₹20,000 at PG level)",
    eligibilitySummary: "Class 12th >80th Percentile • Enrolled in regular degree course • Family annual income < ₹4.5 Lakhs",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://www.education.gov.in",
    sourceName: "Ministry of Education (DoHE), Govt of India",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    tags: ["Central Sector", "Scholarship", "NSP Portal", "College Degree", "Aadhaar DBT"],
    requiredDocuments: ["Aadhaar", "Class 12th Marksheet", "Income Certificate", "Bank Passbook", "College Bonafide"]
  },
  {
    _id: "scheme-post-matric-sc",
    name: "Post Matric Scholarship Scheme for SC/ST/OBC Students",
    shortDescription: "100% tuition fee reimbursement and maintenance allowance for students pursuing post-matriculation studies.",
    fullDescription: "Centrally sponsored scholarship operated by the Ministry of Social Justice and Empowerment to remove economic obstacles for underprivileged students pursuing higher education.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["SC/ST/OBC Students", "Engineering & Medical Students", "Diploma Holders"],
    benefitSummary: "100% Tuition Fee Waiver + Up to ₹1,200 / Month Academic Allowance",
    eligibilitySummary: "Belong to SC/ST/OBC category • Pursuing post-matric courses • Annual parental income ≤ ₹2.5 Lakhs",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://socialjustice.gov.in",
    sourceName: "Ministry of Social Justice and Empowerment",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&auto=format&fit=crop&q=80",
    tags: ["Post Matric", "Tuition Waiver", "SC / ST / OBC", "State Domicile"],
    requiredDocuments: ["Aadhaar", "Caste Certificate", "Income Certificate", "Marksheet", "Admission Fee Receipt"]
  },
  {
    _id: "scheme-aicte-pragati",
    name: "AICTE Pragati Scholarship for Girl Students (Technical Degree)",
    shortDescription: "Empowering young women pursuing professional and technical degree/diploma education across recognized AICTE institutions.",
    fullDescription: "A flagship initiative by AICTE to foster technical education among girls. Covers college tuition fees, books, and essential software/equipment.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["Girl Students", "B.E. / B.Tech Freshers", "Technical Scholars"],
    benefitSummary: "₹50,000 / Annum Direct DBT for every year of technical study",
    eligibilitySummary: "Female students admitted to 1st year of Degree/Diploma in AICTE approved college • Family income < ₹8 Lakh/yr",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://www.aicte-india.org",
    officialSourceUrl: "https://scholarships.gov.in",
    sourceName: "All India Council for Technical Education (AICTE)",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80",
    tags: ["AICTE", "Girls in Tech", "Technical Grant", "₹50,000 DBT"],
    requiredDocuments: ["Aadhaar", "College Admission Proof", "Class 12th Marksheet", "Income Certificate"]
  },

  // ========================================================
  // 2. HEALTHCARE & WELLNESS (HEALTH)
  // ========================================================
  {
    _id: "scheme-ayushman-bharat",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)",
    shortDescription: "World's largest government-funded health assurance scheme providing cashless hospitalisation to over 55 crore citizens.",
    fullDescription: "Operated by the National Health Authority. Provides health protection cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization across 28,000+ empanelled public and private hospitals.",
    category: "HEALTH",
    state: "All-India",
    targetAudience: ["Vulnerable Families", "Rural & Urban Workers", "Senior Citizens (70+)"],
    benefitSummary: "₹5,00,000 Cashless Health Cover / Family / Year",
    eligibilitySummary: "SECC Listed Vulnerable Families • Ayushman Golden Card Holders • All Senior Citizens aged 70+",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://beneficiary.nha.gov.in",
    officialSourceUrl: "https://pmjay.gov.in",
    sourceName: "National Health Authority, Ministry of Health & Family Welfare",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    tags: ["Cashless Health", "₹5 Lakh Cover", "Hospitalization", "Golden Card"],
    requiredDocuments: ["Aadhaar", "Ration Card", "ABHA Health ID"]
  },

  // ========================================================
  // 3. CLEAN ENERGY & GENERAL WELFARE (GENERAL)
  // ========================================================
  {
    _id: "scheme-pm-surya-ghar",
    name: "PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)",
    shortDescription: "Direct government subsidy to provide up to 300 units of free electricity every month to 1 crore residential households.",
    fullDescription: "Launched by the Ministry of New and Renewable Energy. Subsidizes the installation of residential solar rooftop systems with instant direct benefit transfer to the applicant's bank account upon DISCOM inspection.",
    category: "GENERAL",
    state: "All-India",
    targetAudience: ["Residential Households", "Home Owners", "Clean Energy Adopters"],
    benefitSummary: "Up to ₹78,000 Direct Subsidy + 300 Units Free Electricity / Month",
    eligibilitySummary: "Indian citizen owning a residential house with suitable roof space and grid electricity connection",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmsuryaghar.gov.in",
    officialSourceUrl: "https://mnre.gov.in",
    sourceName: "Ministry of New and Renewable Energy (MNRE)",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    tags: ["Rooftop Solar", "Muft Bijli", "₹78,000 Subsidy", "Clean Energy"],
    requiredDocuments: ["Aadhaar", "Electricity Bill (DISCOM)", "House Ownership / Roof Proof", "Bank Passbook"]
  },
  {
    _id: "scheme-atal-pension",
    name: "Atal Pension Yojana (APY)",
    shortDescription: "Guaranteed monthly pension scheme for all unorganised sector workers after attaining 60 years of age.",
    fullDescription: "Administered by the Pension Fund Regulatory and Development Authority (PFRDA). Subscribers receive a guaranteed minimum monthly pension ranging from ₹1,000 to ₹5,000 depending on contributions.",
    category: "GENERAL",
    state: "All-India",
    targetAudience: ["Unorganized Workers", "Gig Workers", "Self-Employed Citizens"],
    benefitSummary: "Guaranteed ₹1,000 to ₹5,000 / Month Lifetime Pension",
    eligibilitySummary: "Indian citizens aged 18 to 40 years • Savings bank account linked to Aadhaar • Non-income tax payer",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://www.npscra.nsdl.co.in",
    officialSourceUrl: "https://pfrda.org.in",
    sourceName: "PFRDA, Ministry of Finance",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&auto=format&fit=crop&q=80",
    tags: ["Pension", "Social Security", "Senior Citizen", "Monthly Income"],
    requiredDocuments: ["Aadhaar", "Bank Account Details", "Mobile Number"]
  },

  // ========================================================
  // 4. KISAN & AGRICULTURE (KISAN)
  // ========================================================
  {
    _id: "scheme-pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    shortDescription: "Direct financial support of ₹6,000 per year to small and marginal farmer families to meet agricultural input costs.",
    fullDescription: "A 100% Central Sector Scheme implemented by the Ministry of Agriculture and Farmers Welfare. Direct income support is deposited into Aadhaar-seeded bank accounts in three equal 4-monthly installments of ₹2,000 each.",
    category: "KISAN",
    state: "All-India",
    targetAudience: ["Landholding Farmers", "Marginal Cultivators", "Agri Families"],
    benefitSummary: "₹6,000 / Year DBT in 3 Equal Installments of ₹2,000",
    eligibilitySummary: "Landholding farmer families with cultivable land recorded in State Land Records • Active e-KYC",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://pmkisan.gov.in",
    officialSourceUrl: "https://agricoop.nic.in",
    sourceName: "Ministry of Agriculture & Farmers Welfare",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    tags: ["Direct Cash", "PM-KISAN", "Farmer Support", "Central Sector"],
    requiredDocuments: ["Aadhaar", "Land Ownership Record (Khata/Khasra)", "Aadhaar-Linked Bank Account"]
  },
  {
    _id: "scheme-pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortDescription: "Comprehensive crop loss protection and financial insurance against natural calamities, pests, and unseasonal rainfall.",
    fullDescription: "Provides financial support to farmers suffering crop damage due to unforeseen weather events. Farmers pay nominal premiums (1.5% for Rabi, 2% for Kharif, 5% for Commercial crops), with government paying the balance.",
    category: "KISAN",
    state: "All-India",
    targetAudience: ["All Farmers", "Tenant Farmers", "Sharecroppers"],
    benefitSummary: "100% Comprehensive Sum Insured Payout on Verified Crop Loss",
    eligibilitySummary: "Farmers growing notified crops in notified areas during Kharif/Rabi seasons",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmfby.gov.in",
    officialSourceUrl: "https://agricoop.nic.in",
    sourceName: "Ministry of Agriculture & Farmers Welfare",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    tags: ["Crop Insurance", "Fasal Bima", "Disaster Protection", "Kharif & Rabi"],
    requiredDocuments: ["Aadhaar", "Sowing Certificate / Patwari Report", "Land Record (ROR)", "Bank Passbook"]
  },

  // ========================================================
  // 5. AFFORDABLE HOUSING (HOUSING)
  // ========================================================
  {
    _id: "scheme-pmay",
    name: "Pradhan Mantri Awas Yojana (PMAY - Gramin & Urban)",
    shortDescription: "Direct financial grant for the construction of pucca houses equipped with basic civic amenities for kutcha house dwellers.",
    fullDescription: "Implements Housing for All through direct capital grants deposited into beneficiary bank accounts in geo-tagged construction stages.",
    category: "HOUSING",
    state: "All-India",
    targetAudience: ["Homeless Families", "Kutcha House Dwellers", "EWS / LIG Households"],
    benefitSummary: "₹1,20,000 (Plains) to ₹2,50,000 (Hilly/Urban) Direct Construction Subsidy",
    eligibilitySummary: "Families without a permanent pucca house anywhere in India • Listed under SECC/Awas+ survey",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://pmayg.nic.in",
    officialSourceUrl: "https://mohua.gov.in",
    sourceName: "Ministry of Rural Development & MoHUA",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
    tags: ["Pucca House", "Awas Yojana", "Direct Grant", "Geo-Tagged DBT"],
    requiredDocuments: ["Aadhaar", "Job Card / Ration Card", "Land / Site Document", "Bank Passbook"]
  },

  // ========================================================
  // 6. MSME, BUSINESS & VENDORS (BUSINESS)
  // ========================================================
  {
    _id: "scheme-pm-svanidhi",
    name: "PM SVANidhi: Micro-Credit Scheme for Street Vendors",
    shortDescription: "Collateral-free working capital micro-loans with 7% interest subsidy and cashback rewards on digital payments.",
    fullDescription: "Launched by MoHUA to support street vendors in re-establishing their businesses. Provides initial credit of ₹10,000, progressing to ₹20,000 and ₹50,000 upon timely digital repayments.",
    category: "BUSINESS",
    state: "All-India",
    targetAudience: ["Street Vendors", "Hawkers", "Micro Entrepreneurs"],
    benefitSummary: "₹10,000 to ₹50,000 Collateral-Free Loan + 7% Interest Cashback",
    eligibilitySummary: "Street vendors operating in urban areas with Vending Certificate or Urban Local Body (ULB) recommendation",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmsvanidhi.mohua.gov.in",
    officialSourceUrl: "https://mohua.gov.in",
    sourceName: "Ministry of Housing and Urban Affairs (MoHUA)",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    tags: ["Street Vendor", "Collateral Free", "Micro Loan", "Interest Subsidy"],
    requiredDocuments: ["Aadhaar", "Vending Certificate / ULB Letter", "Bank Account Details"]
  },
  {
    _id: "scheme-pm-mudra",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    shortDescription: "Institutional business loans up to ₹10 Lakhs without collateral for non-corporate micro and small enterprises.",
    fullDescription: "Under PMMY, loans are categorized into Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh) through commercial banks, RRBs, and NBFCs.",
    category: "BUSINESS",
    state: "All-India",
    targetAudience: ["Shopkeepers", "Artisans", "Small Manufacturers", "Service Units"],
    benefitSummary: "Collateral-Free Business Credit up to ₹10,00,000 at competitive bank rates",
    eligibilitySummary: "Non-farm small business enterprises engaged in manufacturing, trading, or services",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://www.mudra.org.in",
    officialSourceUrl: "https://financialservices.gov.in",
    sourceName: "Department of Financial Services, Ministry of Finance",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    tags: ["Mudra Loan", "Shishu & Kishore", "Collateral Free", "MSME"],
    requiredDocuments: ["Aadhaar", "PAN Card", "Business Address Proof", "6 Months Bank Statement"]
  },

  // ========================================================
  // 7. WOMEN & CHILD DEVELOPMENT (WOMEN)
  // ========================================================
  {
    _id: "scheme-pmmvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    shortDescription: "Direct cash incentive of ₹5,000 to pregnant women and lactating mothers for health, nutrition, and partial wage loss.",
    fullDescription: "Implemented by the Ministry of Women and Child Development. Transferred directly to mother's Aadhaar-linked bank account in installments upon institutional health checkups and vaccinations.",
    category: "WOMEN",
    state: "All-India",
    targetAudience: ["Pregnant Women", "Lactating Mothers"],
    benefitSummary: "₹5,000 Direct Cash Transfer deposited directly to mother's account",
    eligibilitySummary: "Pregnant women and lactating mothers for first/second live child (special incentive if second child is a girl)",
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmmvy.wcd.gov.in",
    officialSourceUrl: "https://wcd.nic.in",
    sourceName: "Ministry of Women and Child Development",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80",
    tags: ["Maternal Health", "Direct Cash", "Nutrition", "Women Empowerment"],
    requiredDocuments: ["Aadhaar of Mother & Husband", "MCP Card", "Aadhaar-Linked Bank Account"]
  },
  {
    _id: "scheme-sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    shortDescription: "High-interest, sovereign-backed savings scheme for girl child with 100% tax exemption under Section 80C.",
    fullDescription: "A small-deposit scheme under Beti Bachao Beti Padhao offering currently 8.2% annual compound interest. Matures when the girl child reaches 21 years of age.",
    category: "WOMEN",
    state: "All-India",
    targetAudience: ["Parents of Girl Child below 10 years"],
    benefitSummary: "8.2% Compounded Interest + 100% Tax-Free Maturity Corpus",
    eligibilitySummary: "Girl child under 10 years of age through natural or legal guardian (maximum 2 accounts per family)",
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://www.indiapost.gov.in",
    officialSourceUrl: "https://financialservices.gov.in",
    sourceName: "Department of Posts & Ministry of Finance",
    verificationStatus: "VERIFIED",
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80",
    tags: ["Girl Child", "High Interest", "Tax Exemption", "Post Office"],
    requiredDocuments: ["Birth Certificate of Girl Child", "Guardian Aadhaar & PAN", "Proof of Residence"]
  }
];

export default STATUTORY_SCHEMES;
