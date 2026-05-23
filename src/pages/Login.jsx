import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

// logo
import Logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const data = res.data;

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", form.username);
        localStorage.setItem("nama", data.nama || form.username);
        localStorage.setItem("role", data.role || "-");
        localStorage.setItem("id_kasir", data.id_kasir);
        localStorage.setItem("id_lokasi", data.id_lokasi);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate(data.role === "admin" ? "/stock" : "/kasir", {
          replace: true,
        });
      } else {
        setError(data?.message || "Login gagal");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Terjadi kesalahan pada server, coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-pink-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600">
        {/* Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-pink-200/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <img
            src={Logo}
            alt="Logo"
            className="w-28 h-28 object-contain mb-8 bg-white p-4 rounded-3xl shadow-2xl"
          />

          <h1 className="text-5xl font-bold leading-tight">TOKO YANI</h1>

          <p className="mt-5 text-lg text-pink-50 max-w-md leading-relaxed">
            Smart POS System untuk membantu pengelolaan toko, transaksi kasir,
            dan stock barang menjadi lebih cepat, modern, dan efisien.
          </p>

          {/* Feature */}
          <div className="mt-10 flex gap-4">
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-4 shadow-lg">
              <h3 className="text-2xl font-bold">Fast</h3>

              <p className="text-sm text-pink-100 mt-1">
                Proses transaksi lebih cepat
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-4 shadow-lg">
              <h3 className="text-2xl font-bold">Secure</h3>

              <p className="text-sm text-pink-100 mt-1">
                Data aman & sistem stabil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 p-6 sm:p-8">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center lg:hidden mb-8">
            <img
              src={Logo}
              alt="Logo"
              className="w-20 h-20 object-contain mb-4"
            />

            <h1 className="text-2xl font-bold text-pink-600">TOKO YANI</h1>

            <p className="text-sm text-slate-500 mt-1">Smart POS System</p>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back 👋
            </h2>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Login untuk masuk ke dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="
                  mt-2
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border border-pink-200
                  bg-pink-50/50
                  text-sm sm:text-base
                  focus:border-pink-500
                  focus:ring-4 focus:ring-pink-200
                  outline-none
                  transition
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="
                    w-full
                    h-12
                    px-4 pr-12
                    rounded-xl
                    border border-pink-200
                    bg-pink-50/50
                    text-sm sm:text-base
                    focus:border-pink-500
                    focus:ring-4 focus:ring-pink-200
                    outline-none
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-pink-400
                    hover:text-pink-600
                  "
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-xl
                bg-gradient-to-r
                from-pink-400
                via-pink-500
                to-pink-600
                hover:opacity-90
                active:scale-[0.98]
                text-white
                font-semibold
                text-sm sm:text-base
                shadow-lg shadow-pink-300/40
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs sm:text-sm text-center text-slate-400 mt-8">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-semibold">Toko Yani</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
