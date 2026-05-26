import React from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Users,
  FileText,
  DollarSign,
  LogOut,
  BadgeInfo,
  Gift,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const role = localStorage.getItem("role");

  const menuItems = [
    ...(role !== "admin"
      ? [{ name: "Kasir", icon: <LayoutDashboard size={20} />, path: "/kasir" }]
      : []),
    { name: "Stock", icon: <Package size={20} />, path: "/stock" },
    { name: "Pelanggan", icon: <Users size={20} />, path: "/pelanggan" },
    { name: "Hutang", icon: <DollarSign size={20} />, path: "/hutang" },
    { name: "Loyalty", icon: <Gift size={20} />, path: "/loyalty" },
    ...(role === "admin"
      ? [{ name: "Laporan", icon: <FileText size={20} />, path: "/laporan" }]
      : []),

    { name: "Tentang", icon: <BadgeInfo size={20} />, path: "/tentang" },
  ];

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.clear();
      window.location.href = "/login";
    } catch {
      alert("Logout gagal. Coba lagi.");
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div
        className={`hidden md:flex h-screen backdrop-blur-lg bg-gradient-to-b from-pink-500 to-rose-400 text-white shadow-xl transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold tracking-wide">TOKO YANI</h1>
              <p className="text-xs opacity-70">Outlook Project</p>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-pink-600 font-semibold shadow-md"
                    : "hover:bg-white/20"
                }`
              }
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={() => {
              if (window.confirm("Yakin ingin logout?")) handleLogout();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500 transition"
          >
            <LogOut size={18} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM TAB ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-all ${
                  isActive ? "text-pink-600 font-semibold" : "text-gray-500"
                }`
              }
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => {
              if (window.confirm("Yakin ingin logout?")) handleLogout();
            }}
            className="flex flex-col items-center text-xs text-gray-500"
          >
            <LogOut size={20} />
            <span className="mt-1">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
