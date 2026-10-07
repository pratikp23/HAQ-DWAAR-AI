import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Shield,
  Key,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Check,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile, changePassword } from "../../services/authApi";
import { OFFICER_AVATARS, getDefaultAvatar } from "../../utils/officerAvatars";

export default function AdminProfile() {
  const { user, updateUser } = useAuth();

  // Active Avatar State
  const initialAvatar = user?.avatar || getDefaultAvatar(user?.role, user?.department);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
    officeLocation: user?.officeLocation || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Feedback State
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Handle custom photo upload
  const handleCustomPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        designation: formData.designation,
        officeLocation: formData.officeLocation,
        avatar: selectedAvatar,
      });

      const isSuccess = res?.success !== false;
      const updatedUser = res?.data?.user || res?.user || res?.data;

      if (isSuccess) {
        if (updatedUser) {
          updateUser(updatedUser);
        }
        setProfileSuccess(res?.message || "Profile & Avatar saved successfully!");
      } else {
        setProfileError(res?.message || "Failed to update profile.");
      }
    } catch (err) {
      setProfileError(err?.message || err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      setSavingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setSavingPassword(false);
      return;
    }

    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res?.success !== false) {
        setPasswordSuccess(res?.message || "Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordError(res?.message || "Failed to change password.");
      }
    } catch (err) {
      setPasswordError(err?.message || err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#3b0764] text-white p-6 rounded-3xl shadow-md border border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
              {user?.role === "chief_officer"
                ? "Chief Govt Officer"
                : user?.role === "category_admin"
                ? `${user?.department} Admin`
                : "Super Admin"}
            </span>
            <span className="text-purple-300 text-xs font-semibold">
              Official Profile &amp; Settings
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admin Profile &amp; Settings
          </h1>
          <p className="text-xs text-purple-200">
            Customize your officer avatar, update your official details, and manage your account security.
          </p>
        </div>

        <Link
          to="/admin"
          className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Grid: Left Column (Avatar), Right Column (Details & Password) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= COLUMN 1: AVATAR CUSTOMIZER ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="text-center space-y-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Officer Profile Avatar
            </h2>

            {/* Current Active Avatar Display */}
            <div className="relative inline-block mx-auto">
              <div className="w-28 h-28 rounded-full border-4 border-purple-900 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center mx-auto">
                <img
                  src={selectedAvatar}
                  alt="Officer Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-xs" title="Active">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="font-extrabold text-slate-900 text-sm">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.designation || "Government Officer"}</div>
            </div>
          </div>

          {/* Preset Avatars Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Choose Preset Officer Avatar:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {OFFICER_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`w-11 h-11 rounded-full p-0.5 border-2 transition transform hover:scale-105 cursor-pointer ${
                    selectedAvatar === av.url
                      ? "border-orange-500 ring-2 ring-orange-400/40"
                      : "border-slate-200 hover:border-purple-400"
                  }`}
                  title={av.label}
                >
                  <img src={av.url} alt={av.label} className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Upload Custom Image */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Or Upload Custom Photo:
            </span>
            <label className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-purple-600 bg-slate-50 hover:bg-purple-50/50 text-xs font-bold text-purple-900 transition cursor-pointer">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Choose Photo (Max 2MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomPhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ================= COLUMN 2: DETAILS & PASSWORD ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-purple-700" />
                <h2 className="text-base font-black text-slate-900">
                  Personal &amp; Official Details
                </h2>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="e.g. Ramesh Sharma"
                  />
                </div>

                {/* Official Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone / Landline</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                {/* Designation */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="e.g. Director DBT / Nodal Officer"
                  />
                </div>

                {/* Office Location */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Office Location</label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="e.g. Krishi Bhawan, New Delhi"
                  />
                </div>
              </div>

              {/* Read-Only Official Credentials */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>Official Email</span>
                  </span>
                  <div className="font-semibold text-slate-800 truncate" title={user?.email}>
                    {user?.email}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Govt Employee ID</span>
                  </span>
                  <div className="font-semibold text-slate-800 font-mono">
                    {user?.govtIdNumber || "NIC-HQ-001"}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <Building className="w-3 h-3" />
                    <span>Ministry / Dept</span>
                  </span>
                  <div className="font-semibold text-purple-900 font-bold">
                    {user?.department || "Central Board"}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#240b49] hover:bg-purple-950 text-white shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-orange-400" />
                  <span>{savingProfile ? "Saving..." : "Save Profile & Avatar"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Key className="w-4 h-4 text-purple-700" />
              <h2 className="text-base font-black text-slate-900">
                Change Password
              </h2>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
