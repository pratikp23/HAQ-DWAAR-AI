import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Scheme from "../models/Scheme.js";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/haqdwaar-ai";

const SCHEMES_SEED_DATA = [
  // ==========================================
  // 5 STUDENT-FOCUSED SCHEMES
  // ==========================================
  {
    name: "Central Sector Scheme of Scholarship for College and University Students (PM-USP)",
    shortDescription:
      "Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher education.",
    fullDescription:
      "The Central Sector Scheme of Scholarship for College and University Students is implemented by the Department of Higher Education. Scholarships are awarded based on senior secondary examination results (above 80th percentile) to students pursuing regular degree courses in recognized colleges and universities.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["Undergraduate Students", "Postgraduate Students", "College Freshers"],
    benefitSummary:
      "₹12,000 per annum at graduation level for first 3 years; ₹20,000 per annum at postgraduate level directly credited to student's bank account.",
    eligibilitySummary:
      "Students above 80th percentile in Class 12 board exams, pursuing regular courses in recognized higher education institutions, with annual family income up to ₹4.5 Lakhs.",
    rules: [
      {
        ruleType: "occupation",
        fieldPath: "occupation.occupationType",
        operator: "equals",
        value: "Student",
        mandatory: true,
        label: "Must be a regular student in higher education",
      },
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 450000,
        mandatory: true,
        label: "Annual family income must not exceed ₹4.5 Lakhs",
      },
      {
        ruleType: "education",
        fieldPath: "education.qualification",
        operator: "in",
        value: ["12th Pass", "Graduate", "Diploma"],
        mandatory: true,
        label: "Minimum qualification: 12th pass or pursuing graduate degree",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Citizen identification" },
      { documentType: "Marksheet", mandatory: true, guidance: "Class 12th board marksheet" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Issued by competent revenue authority" },
      { documentType: "Bank Passbook", mandatory: true, guidance: "Active savings account linked to Aadhaar" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://www.education.gov.in/scholarships-education-loan-0",
    sourceName: "Department of Higher Education, Ministry of Education, Govt. of India",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-15"),
    verificationStatus: "VERIFIED",
    tags: ["scholarship", "higher education", "undergraduate", "btech", "central sector"],
  },
  {
    name: "Post Matric Scholarship Scheme for SC Students",
    shortDescription:
      "Complete tuition fee reimbursement and academic allowance for Scheduled Caste students pursuing post-matriculation studies.",
    fullDescription:
      "Centrally sponsored scheme operated by the Ministry of Social Justice and Empowerment in partnership with state governments. Aims to enhance the enrolment of SC students in post-matric courses by removing financial barriers.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["SC Students", "Technical & Professional Students", "Post-Matric Students"],
    benefitSummary:
      "100% reimbursement of non-refundable tuition and institutional fees plus monthly maintenance allowance up to ₹1,200 per month.",
    eligibilitySummary:
      "Must belong to Scheduled Caste (SC) category, enrolled in recognized post-matric/post-secondary courses, with total parental annual income not exceeding ₹2.5 Lakhs.",
    rules: [
      {
        ruleType: "category",
        fieldPath: "personal.category",
        operator: "equals",
        value: "SC",
        mandatory: true,
        label: "Must belong to Scheduled Caste (SC) community",
      },
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 250000,
        mandatory: true,
        label: "Parental annual income must be ₹2.5 Lakhs or below",
      },
      {
        ruleType: "occupation",
        fieldPath: "occupation.occupationType",
        operator: "equals",
        value: "Student",
        mandatory: true,
        label: "Must be currently enrolled as a student",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Identity and biometric verification" },
      { documentType: "Caste Certificate", mandatory: true, guidance: "SC caste certificate issued by Tehsildar/SDM" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Valid annual family income certificate" },
      { documentType: "Marksheet", mandatory: true, guidance: "Previous qualifying examination marksheet" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://socialjustice.gov.in/schemes/48",
    sourceName: "Ministry of Social Justice and Empowerment, Govt. of India",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-07-20"),
    verificationStatus: "VERIFIED",
    tags: ["scholarship", "sc students", "post matric", "fee waiver"],
  },
  {
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    shortDescription:
      "Empowering young women pursuing technical degree or diploma education in AICTE-approved institutions with tuition and equipment support.",
    fullDescription:
      "Implemented by the All India Council for Technical Education (AICTE) to encourage girl students to pursue technical education. Up to two girl children per family admitted to the first year of degree or diploma courses in AICTE-approved institutions are eligible.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["Female Engineering Students", "Technical Diploma Students", "Women in STEM"],
    benefitSummary:
      "₹50,000 per annum towards college tuition fee payment, books, computer/laptop purchase, and stationeries.",
    eligibilitySummary:
      "Female students admitted to 1st year degree/diploma technical courses in AICTE approved institutions, with annual family income not exceeding ₹8 Lakhs.",
    rules: [
      {
        ruleType: "gender",
        fieldPath: "personal.gender",
        operator: "equals",
        value: "Female",
        mandatory: true,
        label: "Exclusive to female candidates",
      },
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 800000,
        mandatory: true,
        label: "Family annual income must not exceed ₹8 Lakhs",
      },
      {
        ruleType: "occupation",
        fieldPath: "occupation.occupationType",
        operator: "equals",
        value: "Student",
        mandatory: true,
        label: "Must be currently enrolled in technical education",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Identity proof" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Income certificate showing < ₹8 Lakhs" },
      { documentType: "Marksheet", mandatory: true, guidance: "Class 10th and 12th marksheets" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    sourceName: "All India Council for Technical Education (AICTE)",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-01"),
    verificationStatus: "VERIFIED",
    tags: ["women", "engineering", "btech", "aicte", "technical"],
  },
  {
    name: "Ishan Uday Special Scholarship Scheme for NER",
    shortDescription:
      "Special scholarship initiative by UGC promoting higher education and professional degrees for students domiciled in the North Eastern Region.",
    fullDescription:
      "The University Grants Commission (UGC) launched Ishan Uday to improve GER (Gross Enrolment Ratio) and promote professional education in the North Eastern States. 10,000 fresh scholarships are awarded annually.",
    category: "STUDENT",
    state: "All-India",
    targetAudience: ["North Eastern Students", "Degree Students", "Professional College Students"],
    benefitSummary:
      "₹5,400 per month for general degree courses and ₹7,800 per month for technical/medical/professional degree programs.",
    eligibilitySummary:
      "Students with domicile of North Eastern Region (NER) who have passed Class 12th or equivalent and secured admission into first-year degree courses, with annual family income up to ₹4.5 Lakhs.",
    rules: [
      {
        ruleType: "occupation",
        fieldPath: "occupation.occupationType",
        operator: "equals",
        value: "Student",
        mandatory: true,
        label: "Must be a regular full-time undergraduate student",
      },
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 450000,
        mandatory: true,
        label: "Family income must be below ₹4.5 Lakhs per year",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Aadhaar card" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Income proof" },
      { documentType: "Marksheet", mandatory: true, guidance: "Class 12th marksheet" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://scholarships.gov.in",
    officialSourceUrl: "https://www.ugc.gov.in/page/Ishan-Uday.aspx",
    sourceName: "University Grants Commission (UGC), Ministry of Education",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-06-10"),
    verificationStatus: "VERIFIED",
    tags: ["ner", "ugc", "northeast", "undergraduate"],
  },
  {
    name: "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) - MP",
    shortDescription:
      "Madhya Pradesh state government pays full tuition fee for meritorious students admitted to engineering, medical, law, and college courses.",
    fullDescription:
      "Flagship initiative of the Government of Madhya Pradesh to support meritorious students. The state government bears the entire tuition fee for students who scored 70%+ in MP Board or 85%+ in CBSE/ICSE and gained admission in recognized institutions.",
    category: "STUDENT",
    state: "Madhya Pradesh",
    targetAudience: ["MP Domicile Students", "Engineering Freshers", "Medical Students", "B.Tech Students"],
    benefitSummary:
      "100% tuition fee payment directly to government/private colleges up to full government-prescribed ceilings.",
    eligibilitySummary:
      "Citizen must be a domicile of Madhya Pradesh, scored at least 70% in MP Board or 85% in CBSE/ICSE in 12th, with annual parental income up to ₹6 Lakhs.",
    rules: [
      {
        ruleType: "state",
        fieldPath: "location.state",
        operator: "equals",
        value: "Madhya Pradesh",
        mandatory: true,
        label: "Must be a resident/domicile of Madhya Pradesh",
      },
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 600000,
        mandatory: true,
        label: "Annual parental income must not exceed ₹6 Lakhs",
      },
      {
        ruleType: "occupation",
        fieldPath: "occupation.occupationType",
        operator: "equals",
        value: "Student",
        mandatory: true,
        label: "Must be a student pursuing recognized higher education",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Aadhaar card of student" },
      { documentType: "Marksheet", mandatory: true, guidance: "Class 12th board marksheet (70%+ MPBSE or 85%+ CBSE)" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Valid MP revenue department income certificate" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "http://scholarshipportal.mp.nic.in/MedhaviChhatra/Default.aspx",
    officialSourceUrl: "http://scholarshipportal.mp.nic.in",
    sourceName: "Department of Technical Education & Skill Development, Govt. of Madhya Pradesh",
    sourceType: "STATE_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-20"),
    verificationStatus: "VERIFIED",
    tags: ["madhya pradesh", "mmvy", "btech", "fee reimbursement", "state scholarship"],
  },

  // ==========================================
  // 3 KISAN-FOCUSED SCHEMES
  // ==========================================
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortDescription:
      "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    fullDescription:
      "Central sector scheme with 100% funding from Government of India. The scheme provides income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.",
    category: "KISAN",
    state: "All-India",
    targetAudience: ["Farmers", "Small Landholders", "Marginal Farmers"],
    benefitSummary:
      "Direct benefit transfer of ₹6,000 per year deposited directly into bank accounts in 3 installments of ₹2,000 every four months.",
    eligibilitySummary:
      "All farmer families who hold cultivable land in their names, subject to standard exclusion criteria (such as institutional landholders, tax payers, constitutional post holders).",
    rules: [
      {
        ruleType: "farmer_status",
        fieldPath: "kisanDetails.isFarmer",
        operator: "equals",
        value: true,
        mandatory: true,
        label: "Must be an active landholder farmer",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Mandatory Aadhaar linked with bank account" },
      { documentType: "Land Record / Khasra", mandatory: true, guidance: "Land ownership document (Khasra / Khatauni)" },
      { documentType: "Bank Passbook", mandatory: true, guidance: "Bank account details with IFSC code" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    officialSourceUrl: "https://pmkisan.gov.in",
    sourceName: "Department of Agriculture & Farmers Welfare, Ministry of Agriculture, Govt. of India",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-10"),
    verificationStatus: "VERIFIED",
    tags: ["agriculture", "farmer", "income support", "pm kisan", "dbt"],
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortDescription:
      "Comprehensive crop insurance scheme protecting farmers against yield losses due to non-preventable natural risks.",
    fullDescription:
      "PMFBY aims to support sustainable production in agriculture by providing financial support to farmers suffering crop loss or damage arising from unforeseen natural events like floods, drought, pests, and cyclones. Farmer premium is capped at only 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
    category: "KISAN",
    state: "All-India",
    targetAudience: ["Cultivating Farmers", "Sharecroppers", "Tenant Farmers"],
    benefitSummary:
      "Full sum insured compensation against post-harvest and localized crop losses, with low subsidized premiums paid by farmers.",
    eligibilitySummary:
      "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers are eligible for coverage.",
    rules: [
      {
        ruleType: "farmer_status",
        fieldPath: "kisanDetails.isFarmer",
        operator: "equals",
        value: true,
        mandatory: true,
        label: "Must cultivate agricultural land",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Identity verification" },
      { documentType: "Land Record / Khasra", mandatory: true, guidance: "Land record / Record of Rights (RoR)" },
      { documentType: "Bank Passbook", mandatory: true, guidance: "Bank passbook for claim settlement" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmfby.gov.in",
    officialSourceUrl: "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",
    sourceName: "Ministry of Agriculture and Farmers Welfare, Govt. of India",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-07-28"),
    verificationStatus: "VERIFIED",
    tags: ["crop insurance", "drought", "flood", "agriculture", "pmfby"],
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    shortDescription:
      "Institutional crop loans and working capital credit up to ₹3 Lakhs at subsidized interest rates of 4% per annum.",
    fullDescription:
      "Formulated by NABARD and RBI, the KCC scheme provides adequate and timely credit support from the banking system to farmers for their cultivation and other needs including purchase of seeds, fertilizers, pesticides, and post-harvest expenses.",
    category: "KISAN",
    state: "All-India",
    targetAudience: ["Individual Farmers", "Joint Borrowers", "Tenant Farmers", "Self Help Groups"],
    benefitSummary:
      "Revolving cash credit up to ₹3 Lakhs at 7% interest with an additional 3% subvention for prompt repayment (effective rate: 4%).",
    eligibilitySummary:
      "All farmers, individual/joint cultivators, tenant farmers, and self-help groups engaged in agriculture, fisheries, or animal husbandry.",
    rules: [
      {
        ruleType: "farmer_status",
        fieldPath: "kisanDetails.isFarmer",
        operator: "equals",
        value: true,
        mandatory: true,
        label: "Must be engaged in farming or allied agricultural activities",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Identity verification" },
      { documentType: "Land Record / Khasra", mandatory: true, guidance: "Land title records / cultivation proof" },
      { documentType: "Bank Passbook", mandatory: true, guidance: "Bank branch application" },
    ],
    applicationMethod: "HYBRID",
    officialApplicationUrl: "https://www.myscheme.gov.in/schemes/kcc",
    officialSourceUrl: "https://www.nabard.org/content1.aspx?id=591&catid=23&mid=530",
    sourceName: "National Bank for Agriculture and Rural Development (NABARD)",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-06-30"),
    verificationStatus: "VERIFIED",
    tags: ["credit card", "kcc", "crop loan", "subsidized interest", "nabard"],
  },

  // ==========================================
  // 2 GENERAL / CITIZEN-FOCUSED SCHEMES
  // ==========================================
  {
    name: "Pradhan Mantri Awas Yojana - Housing for All (PMAY)",
    shortDescription:
      "Interest subsidy up to ₹2.67 Lakhs on home loans for first-time home buyers in Economically Weaker Sections and Low Income Groups.",
    fullDescription:
      "PMAY addresses urban and rural housing shortages by providing interest subsidies on housing loans for acquisition/construction of houses to eligible families in EWS and LIG categories.",
    category: "GENERAL",
    state: "All-India",
    targetAudience: ["First-time Home Buyers", "Low Income Families", "EWS Households"],
    benefitSummary:
      "Upfront interest subsidy of 6.5% on housing loans up to ₹6 Lakhs, amounting to approximately ₹2.67 Lakhs reduction in loan principal.",
    eligibilitySummary:
      "The beneficiary family must not own a pucca house in their name anywhere in India, with household annual income up to ₹6 Lakhs for EWS/LIG.",
    rules: [
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 600000,
        mandatory: true,
        label: "Annual household income must not exceed ₹6 Lakhs (EWS/LIG)",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Aadhaar cards of all family members" },
      { documentType: "Income Certificate", mandatory: true, guidance: "Income proof or ITR" },
      { documentType: "Bank Passbook", mandatory: true, guidance: "Bank account statement for loan processing" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://pmaymis.gov.in",
    officialSourceUrl: "https://pmaymis.gov.in",
    sourceName: "Ministry of Housing and Urban Affairs, Govt. of India",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-05"),
    verificationStatus: "VERIFIED",
    tags: ["housing", "pmay", "home loan", "interest subsidy", "pucca house"],
  },
  {
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    shortDescription:
      "Cashless health insurance cover of up to ₹5 Lakhs per family per year for secondary and tertiary hospitalization care.",
    fullDescription:
      "World's largest health assurance scheme fully financed by the government. Provides a cover of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across public and empaneled private hospitals in India.",
    category: "GENERAL",
    state: "All-India",
    targetAudience: ["Low Income Families", "Rural & Urban Poor", "Senior Citizens 70+"],
    benefitSummary:
      "Cashless and paperless access to healthcare services up to ₹5 Lakhs per family per year at public and private empaneled hospitals.",
    eligibilitySummary:
      "Households identified under Socio-Economic Caste Census (SECC 2011) deprivation criteria, and all Indian citizens aged 70 years and above irrespective of income.",
    rules: [
      {
        ruleType: "income",
        fieldPath: "occupation.annualIncome",
        operator: "less_than_or_equal",
        value: 500000,
        mandatory: false,
        label: "Targeted toward vulnerable low and moderate income families",
      },
    ],
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Aadhaar card for biometric eKYC" },
      { documentType: "Bank Passbook", mandatory: false, guidance: "Optional bank passbook" },
    ],
    applicationMethod: "ONLINE",
    officialApplicationUrl: "https://beneficiary.nha.gov.in",
    officialSourceUrl: "https://pmjay.gov.in",
    sourceName: "National Health Authority (NHA), Ministry of Health & Family Welfare",
    sourceType: "CENTRAL_GOVERNMENT",
    sourceLastVerified: new Date("2026-08-18"),
    verificationStatus: "VERIFIED",
    tags: ["health", "hospitalization", "ayushman bharat", "pmjay", "medical cover"],
  },
];

/**
 * Main database seed function
 */
export async function seedDatabase() {
  console.log("========================================================");
  console.log("  HAQ DWAAR AI — Scheme Database Seeding Script");
  console.log("========================================================");

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);

    // 1. Seed or verify Admin Account
    const adminEmail = "admin@haqdwaar.local";
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("admin123", salt);
      adminUser = await User.create({
        name: "HaqDwaar Administrator",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
      console.log(`[Admin] Created default admin account: ${adminEmail} (password: admin123)`);
    } else {
      console.log(`[Admin] Admin account already exists: ${adminEmail}`);
    }

    // 2. Upsert schemes
    let insertedCount = 0;
    let updatedCount = 0;

    for (const schemeData of SCHEMES_SEED_DATA) {
      // Attach admin as verifiedBy for VERIFIED schemes
      if (schemeData.verificationStatus === "VERIFIED") {
        schemeData.verifiedBy = adminUser._id;
      }

      const existing = await Scheme.findOne({ name: schemeData.name });

      if (existing) {
        await Scheme.updateOne({ _id: existing._id }, { $set: schemeData });
        updatedCount++;
      } else {
        await Scheme.create(schemeData);
        insertedCount++;
      }
    }

    const totalSchemes = await Scheme.countDocuments();
    const verifiedCount = await Scheme.countDocuments({ verificationStatus: "VERIFIED" });

    console.log("--------------------------------------------------------");
    console.log(`  Schemes Inserted:     ${insertedCount}`);
    console.log(`  Schemes Updated:      ${updatedCount}`);
    console.log(`  Total Active Schemes: ${totalSchemes}`);
    console.log(`  Verified Schemes:     ${verifiedCount}`);
    console.log("========================================================");
    console.log("  Seeding completed successfully!");
    console.log("========================================================");

    return { insertedCount, updatedCount, totalSchemes, verifiedCount };
  } catch (error) {
    console.error("[Seeding Error] Failed to seed schemes:", error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("[MongoDB] Disconnected.");
  }
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith("seedSchemes.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
