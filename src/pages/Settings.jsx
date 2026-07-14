
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { LogOut, Trash2, AlertTriangle } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(BASE_URL + "/profile/delete", {
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-bg text-white page-container">
      <div className="max-w-md mx-auto">
        <h1 className="page-title mb-2">Settings</h1>
        <p className="page-subtitle mb-8">Manage your account preferences</p>

        <div className="card p-5 sm:p-6 mb-6">
          <h2 className="font-semibold mb-1">Account</h2>
          <p className="text-sm text-gray-400 mb-5">Sign out of your DevTinder account on this device.</p>
          <button
            onClick={handleLogout}
            className="btn-danger w-full sm:w-auto"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="card p-5 sm:p-6 border-red-500/20">
          <h2 className="font-semibold mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-400 mb-5">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl px-4 py-2.5 hover:bg-red-500/10 transition w-full sm:w-auto"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Centered reassurance modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>

          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-400" />
            </div>

            <h3 className="font-semibold text-lg mb-2">Delete your account?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete your profile, connections, and messages. This action <span className="text-white font-medium">cannot be undone</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;