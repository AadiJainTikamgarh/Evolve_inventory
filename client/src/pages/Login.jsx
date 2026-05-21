import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, User as UserIcon, AlertTriangle, Key, Copy, Check, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  const handleAutofill = (email, password) => {
    setIsRegistering(false);
    setFormData({
      name: "",
      email,
      password,
    });
    setError("");
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isRegistering
      ? "/api/v1/user/register"
      : "/api/v1/user/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegistering
            ? formData
            : { email: formData.email, password: formData.password },
        ),
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Authentication failed");
      }

      if (isRegistering) {
        setIsRegistering(false);
        setError("Registration successful! Please log in.");
        setFormData({ ...formData, name: "", password: "" });
      } else {
        login(json.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans text-gray-200">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-screen overflow-y-auto custom-scrollbar">
        <div className="text-center mb-6 sm:mb-8 mt-2 sm:mt-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00C951]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#00C951]/20">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C951]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {isRegistering ? "Create Account" : "Welcome to Evolve Lab"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            {isRegistering
              ? "Register to access the inventory"
              : "Sign in to manage inventory"}
          </p>
        </div>

        {error && (
          <div
            className={`p-3 sm:p-4 mb-5 sm:mb-6 text-xs sm:text-sm rounded-lg flex items-center gap-3 ${
              error.includes("successful")
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-500"
            }`}
          >
            {!error.includes("successful") && (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          {isRegistering && (
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#121212] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-white focus:border-[#00C951] outline-none transition-all placeholder-gray-600 text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] sm:text-xs text-gray-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#121212] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-white focus:border-[#00C951] outline-none transition-all placeholder-gray-600 text-sm"
                placeholder="manager@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#121212] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-white focus:border-[#00C951] outline-none transition-all placeholder-gray-600 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#00C951] text-black font-semibold rounded-lg py-2.5 hover:bg-[#00b348] transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Processing..." : isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-400 border-t border-gray-800 pt-5 sm:pt-6 mb-2 sm:mb-0">
          {isRegistering ? "Already have an account?" : "Need lab access?"}{" "}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="text-[#00C951] hover:underline focus:outline-none"
          >
            {isRegistering ? "Sign in here" : "Register here"}
          </button>
        </div>
      </div>

      {/* Toggleable Demo Credentials Popup */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {!showDemoPopup ? (
          <button
            onClick={() => setShowDemoPopup(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00C951]/20 to-[#00C951]/10 border border-[#00C951]/30 hover:border-[#00C951]/60 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-[#00C951]/10 hover:scale-105 transition-all duration-300 backdrop-blur-md cursor-pointer animate-pulse"
          >
            <Key className="w-4 h-4 text-[#00C951]" />
            <span className="text-xs font-semibold tracking-wide">Demo Credentials</span>
          </button>
        ) : (
          <div className="bg-[#1A1A1A]/95 border border-gray-800 rounded-2xl shadow-2xl w-80 p-5 backdrop-blur-md transition-all duration-300 transform scale-100 origin-bottom-right">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00C951]" />
                <h3 className="text-sm font-bold text-white font-sans">Demo Credentials</h3>
              </div>
              <button
                onClick={() => setShowDemoPopup(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Manager Account */}
              <div className="bg-[#121212]/80 border border-gray-800 hover:border-[#00C951]/30 rounded-xl p-3 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] bg-[#00C951]/10 border border-[#00C951]/20 text-[#00C951] px-2 py-0.5 rounded-full font-medium">
                    Manager Role
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">Full Access</span>
                </div>
                <div className="text-xs text-gray-300 font-mono break-all mt-1.5 select-all">
                  demo-manager@example.com
                </div>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                  Password: password
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAutofill("demo-manager@example.com", "password")}
                    className="flex-1 bg-[#00C951] text-black font-semibold py-1 rounded-md text-[10px] hover:bg-[#00b348] transition-colors cursor-pointer text-center"
                  >
                    Autofill
                  </button>
                  <button
                    onClick={() => handleCopy("demo-manager@example.com", "manager")}
                    className="bg-gray-800 border border-gray-700 text-gray-300 p-1.5 rounded-md hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
                    title="Copy email"
                  >
                    {copiedKey === "manager" ? (
                      <Check className="w-3.5 h-3.5 text-[#00C951]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Standard User Account */}
              <div className="bg-[#121212]/80 border border-gray-800 hover:border-[#00C951]/30 rounded-xl p-3 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    Standard User
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">View Only</span>
                </div>
                <div className="text-xs text-gray-300 font-mono break-all mt-1.5 select-all">
                  demo-user@example.com
                </div>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                  Password: password
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAutofill("demo-user@example.com", "password")}
                    className="flex-1 bg-blue-500 text-white font-semibold py-1 rounded-md text-[10px] hover:bg-blue-600 transition-colors cursor-pointer text-center"
                  >
                    Autofill
                  </button>
                  <button
                    onClick={() => handleCopy("demo-user@example.com", "user")}
                    className="bg-gray-800 border border-gray-700 text-gray-300 p-1.5 rounded-md hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
                    title="Copy email"
                  >
                    {copiedKey === "user" ? (
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
