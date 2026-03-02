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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const role = localStorage.getItem("role");

  const menuItems = [
    ...(role !== "admin"
      ? [{ name: "Kasir", icon: <LayoutDashboard size={18} />, path: "/kasir" }]
      : []),
    { name: "Stock", icon: <Package size={18} />, path: "/stock" },
    { name: "Hutang", icon: <DollarSign size={18} />, path: "/hutang" },
    ...(role === "admin"
      ? [
          { name: "Pelanggan", icon: <Users size={18} />, path: "/pelanggan" },
          { name: "Laporan", icon: <FileText size={18} />, path: "/laporan" },
        ]
      : []),
    { name: "Tentang", icon: <BadgeInfo size={18} />, path: "/tentang" },
  ];

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
      window.location.href = "/login";
    } catch (err) {
      alert("Logout gagal. Coba lagi.");
    }
  };

  return (
    <div
      className={`h-screen backdrop-blur-lg bg-gradient-to-b from-pink-500 to-rose-400 text-white shadow-xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
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
            title={!isOpen ? item.name : ""}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                isActive
                  ? "bg-white text-pink-600 font-semibold shadow-md"
                  : "hover:bg-white/20"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-pink-600 rounded-r-lg" />
                )}

                <span>{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={() => {
            if (window.confirm("Yakin ingin logout?")) {
              handleLogout();
            }
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
