import React, { useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import api from "../utils/api";

const Navbar = ({ isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = {
    nama: localStorage.getItem("nama") || "User",
    role: localStorage.getItem("role") || "",
  };

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
    <div className="sticky top-0 z-40 h-14 md:h-16 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* LEFT */}
      <div>
        <h2
          className={`text-base md:text-lg font-bold tracking-wide bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent transition-all duration-300 ${
            isSidebarOpen ? "opacity-0 md:opacity-100" : "opacity-100"
          }`}
        >
          TOKO YANI
        </h2>
      </div>

      {/* RIGHT */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 md:gap-3 active:scale-95 transition"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white font-semibold shadow-md">
            {user.nama.charAt(0).toUpperCase()}
          </div>

          {/* Hide text on mobile */}
          <div className="hidden md:flex flex-col leading-tight text-left">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {user.nama}
            </span>

            <span className="text-xs text-gray-400 capitalize">
              {user.role}
            </span>
          </div>

          {/* Hide arrow on mobile */}
          <ChevronDown
            size={16}
            className={`hidden md:block text-gray-500 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
            {/* Mobile User Info */}
            <div className="md:hidden px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700 capitalize">
                {user.nama}
              </p>

              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Yakin ingin logout?")) {
                  handleLogout();
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
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
