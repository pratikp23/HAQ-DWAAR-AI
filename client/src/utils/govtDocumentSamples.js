/**
 * HAQ DWAAR AI — Official Government Document Samples for Testing & Verification
 * 
 * Provides authentic, high-fidelity SVG data URLs representing real-world Indian 
 * Government onboarding credentials required for Nodal Officers / Department Admins.
 */

// 1. Official Government Employee Identity Card
export const SAMPLE_EMPLOYEE_ID = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
  <rect width="600" height="380" rx="16" fill="#ffffff" stroke="#1e0a3c" stroke-width="4"/>
  <rect width="600" height="70" fill="#1e0a3c"/>
  <rect y="70" width="600" height="8" fill="#ea580c"/>
  <circle cx="50" cy="35" r="22" fill="#ffffff"/>
  <text x="50" y="42" font-family="Arial" font-size="20" font-weight="bold" fill="#1e0a3c" text-anchor="middle">🏛️</text>
  <text x="85" y="32" font-family="Arial" font-size="16" font-weight="bold" fill="#ffffff">GOVERNMENT OF INDIA / भारत सरकार</text>
  <text x="85" y="52" font-family="Arial" font-size="12" fill="#fb923c">MINISTRY OF AGRICULTURE &amp; FARMERS WELFARE</text>
  
  <!-- Photo Box -->
  <rect x="40" y="105" width="130" height="160" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="105" cy="165" r="35" fill="#cbd5e1"/>
  <path d="M70,235 Q105,200 140,235 Z" fill="#94a3b8"/>
  <rect x="50" y="275" width="110" height="20" rx="4" fill="#059669"/>
  <text x="105" y="289" font-family="Arial" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">OFFICIAL / राजपत्रित</text>

  <!-- Details -->
  <text x="195" y="125" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">OFFICER NAME:</text>
  <text x="195" y="145" font-family="Arial" font-size="16" font-weight="black" fill="#0f172a">PRATIK PATHAK</text>
  
  <text x="195" y="175" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">DESIGNATION:</text>
  <text x="195" y="195" font-family="Arial" font-size="13" font-weight="bold" fill="#2b0f4c">NODAL OFFICER / JOINT DIRECTOR</text>

  <text x="195" y="225" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">EMPLOYEE CODE / SERVICE ID:</text>
  <text x="195" y="245" font-family="Courier" font-size="14" font-weight="bold" fill="#c2410c">GOV-IND-2026-9921</text>

  <text x="195" y="275" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">MINISTRY / LOCATION:</text>
  <text x="195" y="295" font-family="Arial" font-size="12" font-weight="semibold" fill="#334155">Krishi Bhawan, Dr. Rajendra Prasad Rd, New Delhi</text>

  <!-- Bottom Bar with Seal and Barcode -->
  <line x1="20" y1="320" x2="580" y2="320" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="530" cy="230" r="38" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="4,2"/>
  <text x="530" y="228" font-family="Arial" font-size="8" font-weight="bold" fill="#ea580c" text-anchor="middle">DEPT OF AGRI</text>
  <text x="530" y="240" font-family="Arial" font-size="7" font-weight="bold" fill="#ea580c" text-anchor="middle">OFFICIAL SEAL</text>
  <text x="40" y="350" font-family="Courier" font-size="16" letter-spacing="4" fill="#0f172a">||| | |||| || ||||| |||| | |||</text>
  <text x="450" y="350" font-family="Arial" font-size="10" font-weight="bold" fill="#059669">VALID THRU: 2030</text>
</svg>
`)}`;

// 2. Official Nomination & Authorization Letter from Competent Authority
export const SAMPLE_AUTHORIZATION_LETTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780">
  <rect width="600" height="780" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="30" y="30" width="540" height="720" fill="#fafafa" stroke="#e2e8f0"/>
  
  <!-- Header -->
  <circle cx="300" cy="70" r="24" fill="#1e0a3c"/>
  <text x="300" y="77" font-family="Arial" font-size="20" fill="#ffffff" text-anchor="middle">🏛️</text>
  <text x="300" y="115" font-family="Georgia" font-size="15" font-weight="bold" fill="#1e0a3c" text-anchor="middle">भारत सरकार / GOVERNMENT OF INDIA</text>
  <text x="300" y="133" font-family="Arial" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">MINISTRY OF AGRICULTURE &amp; FARMERS WELFARE</text>
  <text x="300" y="150" font-family="Arial" font-size="10" fill="#64748b" text-anchor="middle">DEPARTMENT OF AGRICULTURE &amp; COOPERATION, KRISHI BHAWAN, NEW DELHI</text>
  <line x1="70" y1="165" x2="530" y2="165" stroke="#1e0a3c" stroke-width="2"/>

  <!-- File Reference -->
  <text x="70" y="195" font-family="Courier" font-size="11" font-weight="bold" fill="#0f172a">File No: F.No. 11015/02/2026-Agri-Coord</text>
  <text x="430" y="195" font-family="Arial" font-size="11" font-weight="bold" fill="#0f172a">Dated: 05-Oct-2026</text>

  <!-- Subject -->
  <rect x="70" y="215" width="460" height="42" fill="#f1f5f9" rx="6"/>
  <text x="80" y="233" font-family="Arial" font-size="11" font-weight="bold" fill="#1e0a3c">SUBJECT: OFFICIAL NOMINATION &amp; AUTHORIZATION ORDER</text>
  <text x="80" y="248" font-family="Arial" font-size="10" fill="#475569">Grant of Department Nodal Administrator clearance on HAQ DWAAR AI portal.</text>

  <!-- Body -->
  <text x="70" y="285" font-family="Arial" font-size="11" fill="#334155">In pursuance of Section 12 of the Digital Governance and Entitlement Framework,</text>
  <text x="70" y="305" font-family="Arial" font-size="11" fill="#334155">it is hereby certified that the under-mentioned official is nominated as the</text>
  <text x="70" y="325" font-family="Arial" font-size="11" font-weight="bold" fill="#1e0a3c">Authorized Nodal Officer (Category Administrator) for KISAN / Agriculture.</text>

  <!-- Officer Box -->
  <rect x="70" y="345" width="460" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="90" y="375" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Nominated Official:</text>
  <text x="230" y="375" font-family="Arial" font-size="12" font-weight="bold" fill="#0f172a">Pratik Pathak</text>
  <text x="90" y="400" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Designation:</text>
  <text x="230" y="400" font-family="Arial" font-size="12" font-weight="bold" fill="#0f172a">Nodal Officer / Joint Director</text>
  <text x="90" y="425" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Service ID / Employee Code:</text>
  <text x="230" y="425" font-family="Courier" font-size="12" font-weight="bold" fill="#c2410c">GOV-IND-2026-9921</text>

  <!-- Mandate Scope -->
  <text x="70" y="485" font-family="Arial" font-size="11" fill="#334155">The officer is authorized to publish Gazette-backed schemes, monitor eligibility criteria,</text>
  <text x="70" y="505" font-family="Arial" font-size="11" fill="#334155">and address citizen grievances. This authorization remains valid until further office orders.</text>

  <!-- Competent Authority Sign & Seal -->
  <circle cx="150" cy="620" r="45" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="150" y="615" font-family="Arial" font-size="8" font-weight="bold" fill="#2563eb" text-anchor="middle">GOVT OF INDIA</text>
  <text x="150" y="628" font-family="Arial" font-size="7" font-weight="bold" fill="#2563eb" text-anchor="middle">★ KRISHI BHAWAN ★</text>

  <path d="M380,590 Q410,570 440,595 T480,580" fill="none" stroke="#1e293b" stroke-width="2.5"/>
  <text x="430" y="625" font-family="Arial" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">(Dr. S. K. Mukherjee, IAS)</text>
  <text x="430" y="640" font-family="Arial" font-size="10" fill="#475569" text-anchor="middle">Joint Secretary to the Government of India</text>
  <text x="430" y="655" font-family="Arial" font-size="9" font-weight="bold" fill="#059669" text-anchor="middle">Digitally Signed &amp; Dispatched</text>

  <!-- Footer -->
  <line x1="70" y1="690" x2="530" y2="690" stroke="#e2e8f0" stroke-width="1"/>
  <text x="300" y="720" font-family="Arial" font-size="9" fill="#94a3b8" text-anchor="middle">CONFIDENTIAL • FOR STATUTORY NODAL AUDIT ONLY • NIC e-GOV NETWORK</text>
</svg>
`)}`;

// 3. Official Ministry Posting Order / Gazette Notification
export const SAMPLE_POSTING_ORDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="520" viewBox="0 0 600 520">
  <rect width="600" height="520" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="25" y="25" width="550" height="470" fill="#fcfcfc" stroke="#e2e8f0"/>
  
  <rect x="25" y="25" width="550" height="40" fill="#1e0a3c"/>
  <text x="300" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">THE GAZETTE OF INDIA / भारत का राजपत्र (EXTRAORDINARY)</text>
  
  <text x="300" y="95" font-family="Arial" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">OFFICIAL NOTIFICATION OF CADRE POSTING</text>
  <text x="300" y="112" font-family="Courier" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">Notification Ref: G.S.R. 412(E) / Agri-Cadre / 2026</text>
  <line x1="50" y1="125" x2="550" y2="125" stroke="#cbd5e1"/>

  <text x="50" y="155" font-family="Arial" font-size="11" fill="#334155">The President of India is pleased to assign Shri <strong>Pratik Pathak</strong> to the post of</text>
  <text x="50" y="175" font-family="Arial" font-size="11" font-weight="bold" fill="#1e0a3c">Nodal Officer &amp; In-Charge (Direct Benefit Transfer Schemes), Ministry of Agriculture.</text>

  <!-- Posting Details Grid -->
  <rect x="50" y="200" width="500" height="130" fill="#ffffff" stroke="#cbd5e1" rx="6"/>
  <text x="70" y="230" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Current Posting:</text>
  <text x="210" y="230" font-family="Arial" font-size="11" font-weight="bold" fill="#0f172a">Krishi Bhawan, New Delhi (Level 12)</text>
  
  <text x="70" y="260" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Department Code:</text>
  <text x="210" y="260" font-family="Courier" font-size="11" font-weight="bold" fill="#0f172a">AGRI-CENTRAL-01</text>
  
  <text x="70" y="290" font-family="Arial" font-size="11" font-weight="bold" fill="#64748b">Reporting Authority:</text>
  <text x="210" y="290" font-family="Arial" font-size="11" font-weight="bold" fill="#0f172a">Joint Secretary (Coordination &amp; Welfare)</text>

  <text x="50" y="365" font-family="Arial" font-size="11" fill="#334155">Ordered that this notification be forwarded to the Apex Nodal Clearance Authority</text>
  <text x="50" y="385" font-family="Arial" font-size="11" fill="#334155">for issuance of digital administrative permissions.</text>

  <!-- Seal -->
  <circle cx="120" cy="440" r="32" fill="none" stroke="#ea580c" stroke-width="2"/>
  <text x="120" y="443" font-family="Arial" font-size="7" font-weight="bold" fill="#ea580c" text-anchor="middle">CADRE CONTROLLING</text>
  
  <text x="440" y="435" font-family="Arial" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">By Order and in the name of the President,</text>
  <text x="440" y="452" font-family="Arial" font-size="10" fill="#475569" text-anchor="middle">Under Secretary to the Government of India</text>
</svg>
`)}`;

// 4. Official Specimen Signature & Office Round Seal Stamp
export const SAMPLE_SPECIMEN_SIGNATURE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340">
  <rect width="600" height="340" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="20" y="20" width="560" height="300" fill="#f8fafc" stroke="#e2e8f0" rx="8"/>
  
  <text x="40" y="55" font-family="Arial" font-size="14" font-weight="bold" fill="#1e0a3c">ATTESTED SPECIMEN SIGNATURE &amp; OFFICIAL SEAL SLIP</text>
  <text x="40" y="75" font-family="Arial" font-size="11" fill="#64748b">Required for digital signing verification against Ministry Records</text>
  <line x1="40" y1="90" x2="560" y2="90" stroke="#cbd5e1"/>

  <!-- Left: Signature Box -->
  <rect x="40" y="115" width="260" height="130" fill="#ffffff" stroke="#94a3b8" rx="6"/>
  <path d="M60,195 Q90,140 130,180 T190,165 T250,175 T270,160" fill="none" stroke="#0f172a" stroke-width="3"/>
  <text x="170" y="235" font-family="Arial" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">SPECIMEN SIGNATURE: PRATIK PATHAK</text>

  <!-- Right: Official Blue Ink Rubber Stamp -->
  <rect x="330" y="115" width="230" height="130" fill="#ffffff" stroke="#94a3b8" rx="6"/>
  <circle cx="445" cy="180" r="45" fill="none" stroke="#1d4ed8" stroke-width="3" stroke-dasharray="6,2"/>
  <text x="445" y="165" font-family="Arial" font-size="8" font-weight="black" fill="#1d4ed8" text-anchor="middle">MINISTRY OF AGRICULTURE</text>
  <text x="445" y="180" font-family="Arial" font-size="8" font-weight="bold" fill="#1d4ed8" text-anchor="middle">★ KRISHI BHAWAN ★</text>
  <text x="445" y="195" font-family="Arial" font-size="8" font-weight="black" fill="#1d4ed8" text-anchor="middle">OFFICE OF NODAL OFFICER</text>

  <text x="40" y="280" font-family="Arial" font-size="10" font-weight="bold" fill="#059669">✓ Attested by Establishment Branch, Ministry of Agriculture</text>
  <text x="40" y="295" font-family="Courier" font-size="9" fill="#64748b">Verification Token: STAMP-2026-9921-VERIFIED</text>
</svg>
`)}`;

export const SAMPLE_GOVT_DOCS = {
  employeeIdCardUrl: SAMPLE_EMPLOYEE_ID,
  authorizationLetterUrl: SAMPLE_AUTHORIZATION_LETTER,
  postingOrderUrl: SAMPLE_POSTING_ORDER,
  specimenSignatureUrl: SAMPLE_SPECIMEN_SIGNATURE,
};
