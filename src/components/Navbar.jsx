import React, { useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user] = useState({
    nama: localStorage.getItem("nama") || "User",
    role: localStorage.getItem("role") || "",
  });

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      alert("Logout gagal. Coba lagi.");
    }
  };

  return (
    <div className="h-16 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative">
      {/* Logo (hidden when sidebar open) */}
      <h2
        className={`text-lg font-bold tracking-wide bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent transition ${
          isSidebarOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        TOKO YANI
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Avatar */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white">
            {user.nama.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {user.nama}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {user.role}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-14 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
            <button
              onClick={() => {
                if (window.confirm("Yakin ingin logout?")) {
                  handleLogout();
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition rounded-lg"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
