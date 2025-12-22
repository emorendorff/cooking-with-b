import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    setIsUpdatingEmail(true);

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMessage({
        text: "Confirmation email sent to your new address. Please check your inbox.",
        error: false,
      });
      setNewEmail("");
    } catch (error) {
      setEmailMessage({
        text: error instanceof Error ? error.message : "Failed to update email",
        error: true,
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match", error: true });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        text: "Password must be at least 6 characters",
        error: true,
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setPasswordMessage({
        text: "Password updated successfully",
        error: false,
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        text:
          error instanceof Error ? error.message : "Failed to update password",
        error: true,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="pt-16 pb-16 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="mb-6 text-gray-700">Settings</h1>

        <div className="mb-8">
          <h2 className="text-base text-burgundy mb-3 pb-2 border-b border-tan text-left normal-case">
            Account Info
          </h2>
          <div className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-700 text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-700">{user?.email || "Not set"}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-700 text-sm">
            <span className="text-gray-500">Last Sign In</span>
            <span className="text-gray-700">{formatDate(user?.last_sign_in_at)}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base text-burgundy mb-3 pb-2 border-b border-tan text-left normal-case">
            Change Email
          </h2>
          <form onSubmit={handleEmailChange} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full p-3 border border-tan rounded-lg text-base focus:outline-none focus:border-burgundy"
            />
            <button
              type="submit"
              disabled={isUpdatingEmail || !newEmail}
              className="px-4 py-3 bg-burgundy text-white border-none rounded cursor-pointer text-sm hover:bg-burgundy-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </button>
            {emailMessage && (
              <p className={`text-sm my-2 ${emailMessage.error ? 'text-red-600' : 'text-green-600'}`}>
                {emailMessage.text}
              </p>
            )}
          </form>
        </div>

        <div className="mb-8">
          <h2 className="text-base text-burgundy mb-3 pb-2 border-b border-tan text-left normal-case">
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-tan rounded-lg text-base focus:outline-none focus:border-burgundy"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-tan rounded-lg text-base focus:outline-none focus:border-burgundy"
            />
            <button
              type="submit"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="px-4 py-3 bg-burgundy text-white border-none rounded cursor-pointer text-sm hover:bg-burgundy-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
            {passwordMessage && (
              <p className={`text-sm my-2 ${passwordMessage.error ? 'text-red-600' : 'text-green-600'}`}>
                {passwordMessage.text}
              </p>
            )}
          </form>
        </div>

        <div className="mb-8">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-tan text-gray-700 border-none rounded cursor-pointer text-sm mt-4 hover:bg-tan-hover"
          >
            Log Out
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Settings;
