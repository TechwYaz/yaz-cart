"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import AccountLayout from "@/components/AccountLayout";

const label = "mb-1.5 block text-sm text-gray-800";
const input = "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20";

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input className={input + " pr-12"} type={show ? "text" : "password"} required placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" className="absolute right-4 top-4 text-gray-400" onClick={() => setShow(!show)}>
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default function Settings() {
  const { token, user, login } = useApp();

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.name) setProfile((p) => ({ ...p, name: user.name }));
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    const body = {};
    if (profile.name) body.name = profile.name;
    if (profile.email) body.email = profile.email;
    if (profile.phone) body.phone = profile.phone;

    try {
      await api("users/updateMe/", { method: "PUT", body, auth: true });
      if (body.name) login(token, body.name);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (passwords.password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwords.password !== passwords.rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await api("users/changeMyPassword", { method: "PUT", body: passwords, auth: true });
      if (res.token) login(res.token, user && user.name);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", password: "", rePassword: "" });
    } catch (err) {
      toast.error(err.message);
    }
    setSaving(false);
  }

  return (
    <AccountLayout>
      <h2 className="text-2xl font-bold">Account Settings</h2>
      <p className="mb-6 mt-1 text-sm text-gray-600">Update your profile information and change your password</p>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <form onSubmit={saveProfile} className="p-8">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><FaUser /></span>
            <div>
              <h3 className="font-bold">Profile Information</h3>
              <p className="text-sm text-gray-600">Update your personal details</p>
            </div>
          </div>
          <label className="mb-5 block"><span className={label}>Full Name</span><input className={input} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
          <label className="mb-5 block"><span className={label}>Email Address</span><input className={input} type="email" placeholder="Enter your email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
          <label className="mb-6 block"><span className={label}>Phone Number</span><input className={input} placeholder="01xxxxxxxxx" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
          <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-brand-700"><FaSave /> Save Changes</button>
        </form>

        <div className="border-t bg-gray-50 p-8">
          <h3 className="mb-4 font-bold">Account Information</h3>
          <div className="flex justify-between py-2 text-sm"><span className="text-gray-600">User ID</span><span className="font-mono">{user && user.id}</span></div>
          <div className="flex items-center justify-between py-2 text-sm"><span className="text-gray-600">Role</span><span className="rounded-lg bg-brand-100 px-3 py-1 text-xs capitalize text-brand-700">{user && user.role ? user.role : "user"}</span></div>
        </div>
      </div>

      <form onSubmit={changePassword} className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><FaLock /></span>
          <div>
            <h3 className="font-bold">Change Password</h3>
            <p className="text-sm text-gray-600">Update your account password</p>
          </div>
        </div>
        <label className="mb-5 block"><span className={label}>Current Password</span><PasswordInput placeholder="Enter your current password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label>
        <label className="mb-5 block"><span className={label}>New Password</span><PasswordInput placeholder="Enter your new password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} /><span className="text-xs text-gray-500">Must be at least 6 characters</span></label>
        <label className="mb-6 block"><span className={label}>Confirm New Password</span><PasswordInput placeholder="Confirm your new password" value={passwords.rePassword} onChange={(e) => setPasswords({ ...passwords, rePassword: e.target.value })} /></label>
        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-orange-600 disabled:opacity-60" disabled={saving}><FaLock /> {saving ? "Saving..." : "Change Password"}</button>
      </form>
    </AccountLayout>
  );
}
