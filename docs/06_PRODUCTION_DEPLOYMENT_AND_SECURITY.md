# 🏛️ HAQ DWAAR AI — Volume 6: Production Deployment & Security Hardening

---

## 1. Security Hardening Checklist

Before deploying HAQ DWAAR AI to production for real citizens, ensure all 8 security layers are active:

### 1. Brute-Force Rate Limiting (`express-rate-limit`)
- Auth routes (`/api/auth/*`): Max **10 requests per 15 minutes** to prevent password spraying.
- General API routes (`/api/*`): Max **100 requests per 15 minutes**.
- Sync triggers (`/api/admin/scheme-sync/trigger`): Max **5 runs per hour**.

### 2. Strict Production JWT Enforcement
- In `server/middleware/authMiddleware.js`, disable fallback development secrets.
- Require `JWT_SECRET` to be a 64-character high-entropy cryptographic hex string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

### 3. HTTP-Only, Secure, SameSite Cookie Configuration
```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",                           // Eliminates CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000,             // 7 Days
});
```

### 4. Input Sanitization & Attack Neutralization
- `express-mongo-sanitize`: Strips dangerous query operators (`$gt`, `$ne`, `$where`) to block NoSQL injection.
- `xss-clean`: Strips raw HTML and `<script>` payloads from citizen inputs.

### 5. Production Error Sanitization
In `server/middleware/errorHandler.js`, ensure error stack traces and internal file paths are stripped in production:
```javascript
res.status(statusCode).json({
  success: false,
  message: err.message || "An internal error occurred.",
  ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
});
```

### 6. PII Masking Guarantee
- 12-digit Aadhaar numbers and PAN identifiers are **never stored in plain text**.
- Evaluated and saved strictly as `XXXX-XXXX-1234` in document vaults and application dossiers.

---

## 2. Real Government Integrations Setup

| Integration | Portal / Link | Approval Time | Production Flag in `.env` |
|:---|:---|:---|:---|
| **data.gov.in API** | [data.gov.in](https://data.gov.in) → "Get API Key" | **Instant** | `DATA_GOV_IN_API_KEY=...` |
| **DigiLocker Gateway** | [developer.digilocker.gov.in](https://developer.digilocker.gov.in) | **1–2 Weeks** | `DIGILOCKER_MODE=production` |
| **Bhashini Voice AI** | [bhashini.gov.in/ulca](https://bhashini.gov.in/ulca) | **1–2 Weeks** | `BHASHINI_MODE=production` |
| **WhatsApp / SMS Gateway**| Meta Cloud API / Msg91 / Twilio | **2–3 Days** | `WHATSAPP_MODE=production` |

---

## 3. Cloud Deployment Guide (Vercel + Railway + Atlas)

### Step 1: Database Setup on MongoDB Atlas
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas).
2. Create a free M0 cluster (located in `ap-south-1` Mumbai for fastest Indian latency).
3. Whitelist Network Access: Allow IP `0.0.0.0/0` (with strong password).
4. Copy Connection String: `mongodb+srv://admin:<password>@haqdwaar.cluster.mongodb.net/haqdwaar-ai`.

### Step 2: Backend Deployment on Railway.app
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub Repo.
2. Set Root Directory to `server`.
3. Add all environment variables (listed below).
4. Railway provisions a high-availability URL: `https://haqdwaar-api.railway.app`.

### Step 3: Frontend Deployment on Vercel
1. Set client environment variable:
   ```env
   VITE_API_URL=https://haqdwaar-api.railway.app
   ```
2. Build production bundle:
   ```bash
   cd client && npm run build
   ```
3. Deploy to Vercel via CLI or GitHub integration:
   ```bash
   vercel --prod
   ```
4. Connect custom domain `haqdwaar.in`. Vercel automatically issues an SSL certificate.

---

## 4. Production `.env` Configuration Template

```env
# ==============================================================================
# HAQ DWAAR AI — PRODUCTION ENVIRONMENT (.env)
# ==============================================================================

NODE_ENV=production
PORT=5000

# MongoDB Atlas Mumbai Replica Set
MONGO_URI=mongodb+srv://haq_admin:SECURE_PASSWORD@haqdwaar.cluster.mongodb.net/haqdwaar-ai?retryWrites=true&w=majority

# JWT 64-character Secret
JWT_SECRET=a8f9c1b7e4d2...[64_HEX_CHARACTERS]...09f1

# Client Production Domains for CORS Whitelist
CLIENT_URL=https://www.haqdwaar.in

# Google Gemini API Key (For NLU & Scheme Normalization)
GEMINI_API_KEY=AIzaSy...YOUR_KEY

# Open Government Data Platform India (data.gov.in)
DATA_GOV_IN_API_KEY=579b464db66ec23bdd...YOUR_KEY

# DigiLocker Production API Credentials
DIGILOCKER_MODE=production
DIGILOCKER_CLIENT_ID=YOUR_DIGILOCKER_CLIENT_ID
DIGILOCKER_CLIENT_SECRET=YOUR_DIGILOCKER_SECRET
DIGILOCKER_REDIRECT_URI=https://haqdwaar-api.railway.app/api/digilocker/callback

# MeitY Bhashini Voice Pipeline
BHASHINI_MODE=production
BHASHINI_BASE_URL=https://dhruva-api.bhashini.gov.in
BHASHINI_API_KEY=YOUR_BHASHINI_KEY
BHASHINI_USER_ID=YOUR_USER_ID
BHASHINI_PIPELINE_ID=YOUR_PIPELINE_ID

# WhatsApp Business / SMS Dispatch
WHATSAPP_MODE=production
WHATSAPP_API_KEY=YOUR_WHATSAPP_KEY
```

---

*HAQ DWAAR AI — Volume 6: Production Deployment & Security Hardening 🇮🇳*
