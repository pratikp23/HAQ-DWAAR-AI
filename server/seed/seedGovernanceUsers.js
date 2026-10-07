import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/haqdwaar-ai";

async function seedGovernanceUsers() {
  console.log("========================================================");
  console.log("  Seeding Multi-Tier Governance Users in MongoDB");
  console.log("========================================================");

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected to ${MONGO_URI}`);

    // 1. Higher-Level Government Verification Officer (Chief Nodal Authority)
    const chiefEmail = "chief.officer@nic.in";
    const chiefPasswordHash = await bcrypt.hash("Officer@123", 10);
    const chiefUser = await User.findOneAndUpdate(
      { email: chiefEmail },
      {
        $set: {
          name: "Dr. Rajeshwar Sharma (IAS)",
          email: chiefEmail,
          passwordHash: chiefPasswordHash,
          role: "chief_officer",
          designation: "Chief Nodal Verification Officer & Joint Secretary",
          govtIdNumber: "GOI/IAS/ND/9842",
          officerStatus: "ACTIVE_VERIFIED",
          department: "ALL",
        },
      },
      { upsert: true, new: true }
    );
    console.log("✓ Chief Government Verification Officer created: chief.officer@nic.in (Password: Officer@123)");

    // 2. Platform Super Admin
    const adminEmail = "admin@haqdwaar.gov.in";
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: "Platform Super Administrator",
          email: adminEmail,
          passwordHash: adminPasswordHash,
          role: "super_admin",
          designation: "Principal Platform Architect",
          officerStatus: "ACTIVE_VERIFIED",
        },
      },
      { upsert: true, new: true }
    );
    console.log("✓ Platform Super Admin created: admin@haqdwaar.gov.in (Password: Admin@123)");

    // 3. Pre-Verified Category / Department Admin (Agriculture / KISAN)
    const kisanEmail = "kisan.admin@gov.in";
    const kisanPasswordHash = await bcrypt.hash("Kisan@123", 10);
    await User.findOneAndUpdate(
      { email: kisanEmail },
      {
        $set: {
          name: "Sunil Verma (Agriculture Nodal)",
          email: kisanEmail,
          passwordHash: kisanPasswordHash,
          role: "category_admin",
          department: "KISAN",
          designation: "Deputy Director, Dept of Agriculture & Farmers Welfare",
          govtIdNumber: "AGRI/ND/2024/5521",
          officerStatus: "ACTIVE_VERIFIED",
          verifiedByChief: chiefUser._id,
        },
      },
      { upsert: true, new: true }
    );
    console.log("✓ Category Admin (KISAN) created: kisan.admin@gov.in (Password: Kisan@123)");

    console.log("========================================================");
    console.log("  All Governance Accounts Successfully Synced!");
    console.log("========================================================");
  } catch (err) {
    console.error("Error seeding governance users:", err);
  } finally {
    await mongoose.disconnect();
    console.log("[MongoDB] Disconnected.");
  }
}

seedGovernanceUsers();
