import React, { useEffect, useState } from "react";
import {
  History,
  Gift,
  RefreshCcw,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
} from "lucide-react";
import api from "../utils/api";

// ─────────────────────────────────────────────
// ALERT HELPER
// ─────────────────────────────────────────────
const useAlert = () => {
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 2500);
  };
  return { alert, showAlert };
};

// ─────────────────────────────────────────────
// REUSABLE SEARCHABLE COMBOBOX
// ─────────────────────────────────────────────
const SearchableCombobox = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Pilih data...",
  displayKey = "label",
  valueKey = "value",
  searchKeys = [],
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedItem = options.find(
    (item) => String(item[valueKey]) === String(value)
  );

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem[displayKey]);
    } else {
      setQuery("");
    }
  }, [value]);

  const filteredOptions = options.filter((item) => {
    const searchTarget = [item[displayKey], ...searchKeys.map((k) => item[k])]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(query.toLowerCase());
  });

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);

            if (!e.target.value) {
              onChange("");
            }
          }}
          className="border border-gray-300 rounded-[10px] pl-9 pr-3 py-2 text-sm w-full focus:ring-[#FF4778] focus:border-[#FF4778] outline-none"
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              Data tidak ditemukan.
            </div>
          ) : (
            filteredOptions.map((item) => (
              <button
                key={item[valueKey]}
                type="button"
                onClick={() => {
                  onChange(item[valueKey]);
                  setQuery(item[displayKey]);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#FFF0F4] hover:text-[#FF4778] transition-colors
                  ${
                    String(item[valueKey]) === String(value)
                      ? "bg-[#FFF0F4] text-[#FF4778]"
                      : ""
                  }
                `}
              >
                {item[displayKey]}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: HISTORI POIN
// ─────────────────────────────────────────────
const TabHistori = () => {
  const [pelangganList, setPelangganList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [histori, setHistori] = useState([]);
  const [pelangganInfo, setPelangganInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/pelanggan/")
      .then((res) => setPelangganList(res.data.data))
      .catch(() => {});
  }, []);

  const fetchHistori = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const [h, p] = await Promise.all([
        api.get(`/pelanggan/${id}/histori-poin`),
        api.get(`/pelanggan/${id}/poin`),
      ]);
      setHistori(h.data.data);
      setPelangganInfo(p.data.data);
    } catch {
      setHistori([]);
      setPelangganInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const filtered = histori.filter((h) =>
    (h.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Pilih Pelanggan
          </label>
          <SearchableCombobox
            value={selectedId}
            onChange={(val) => {
              setSelectedId(val);
              fetchHistori(val);
            }}
            options={pelangganList.map((p) => ({
              value: p.id_pelanggan,
              label: p.nama_pelanggan,
            }))}
            placeholder="Cari pelanggan..."
          />
        </div>
        {pelangganInfo && (
          <div className="flex items-center gap-2 bg-[#FFF0F4] border border-[#FF4778] rounded-[12px] px-4 py-2 text-sm whitespace-nowrap">
            <span className="font-semibold text-gray-700">
              {pelangganInfo.nama_pelanggan}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-[#FF4778] font-bold">
              {pelangganInfo.poin} Poin
            </span>
          </div>
        )}
      </div>

      {selectedId && (
        <div className="relative w-56">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            className="block w-full p-2 pl-8 text-sm border border-gray-300 rounded-[15px] bg-gray-50 focus:ring-[#FF4778] focus:border-[#FF4778] outline-none"
            placeholder="Cari deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <div
        className="relative overflow-x-auto shadow-md sm:rounded-lg"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-center">No</th>
              <th className="px-2 py-2">Tipe</th>
              <th className="px-2 py-2">Poin</th>
              <th className="px-2 py-2">Deskripsi</th>
              <th className="px-2 py-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Memuat...
                </td>
              </tr>
            ) : !selectedId ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-300">
                  Pilih pelanggan untuk melihat histori.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-300">
                  Tidak ada histori.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-2 text-center">{idx + 1}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.tipe === "earn"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.tipe === "earn" ? (
                        <ArrowDownCircle size={12} />
                      ) : (
                        <ArrowUpCircle size={12} />
                      )}
                      {item.tipe}
                    </span>
                  </td>
                  <td
                    className={`px-2 py-2 font-bold ${
                      item.tipe === "earn" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.tipe === "earn" ? "+" : ""}
                    {item.poin}
                  </td>
                  <td className="px-2 py-2">{item.deskripsi || "-"}</td>
                  <td className="px-2 py-2 text-gray-400 text-xs">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PRODUCT SEARCH COMBOBOX
// ─────────────────────────────────────────────
const ProductSearchInput = ({ value, onChange }) => {
  // value = { id_produk, nama_produk }
  const [query, setQuery] = useState(value?.nama_produk || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef(null);

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync jika value berubah dari luar (mis. reset)
  useEffect(() => {
    setQuery(value?.nama_produk || "");
  }, [value?.nama_produk]);

  const handleSearch = async (q) => {
    setQuery(q);
    onChange({ id_produk: "", nama_produk: q }); // reset pilihan
    if (q.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const res = await api.get(`/produk/?search=${encodeURIComponent(q)}`);
      setResults(res.data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (produk) => {
    setQuery(produk.nama_produk);
    onChange({ id_produk: produk.id_produk, nama_produk: produk.nama_produk });
    setOpen(false);
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder="Ketik nama produk..."
          className="border rounded pl-7 pr-2 py-1 w-full text-sm focus:ring-[#FF4778] focus:border-[#FF4778] outline-none"
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ...
          </span>
        )}
      </div>

      {/* Dropdown hasil */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2">
              Produk tidak ditemukan.
            </p>
          ) : (
            results.map((p) => (
              <button
                key={p.id_produk}
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#FFF0F4] hover:text-[#FF4778] transition-colors flex items-center justify-between"
              >
                <span>{p.nama_produk}</span>
                <span className="text-xs text-gray-400">#{p.id_produk}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Badge produk terpilih */}
      {value?.id_produk && (
        <p className="text-xs text-green-600 mt-1">
          ✓ {value.nama_produk}{" "}
          <span className="text-gray-400">(ID: {value.id_produk})</span>
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: REWARD POIN
// ─────────────────────────────────────────────
const TabReward = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showAlert } = useAlert();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // newItem menyimpan { id_produk, nama_produk, poin_required }
  const [newItem, setNewItem] = useState({
    id_produk: "",
    nama_produk: "",
    poin_required: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reward-poin/");
      setData(res.data.data);
    } catch {
      showAlert("error", "Gagal mengambil data reward.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newItem.id_produk) {
      showAlert("error", "Pilih produk terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/reward-poin/", {
        id_produk: Number(newItem.id_produk),
        poin_required: Number(newItem.poin_required),
      });
      await fetchData();
      setAddModalOpen(false);
      setNewItem({ id_produk: "", nama_produk: "", poin_required: "" });
      showAlert("success", "Reward berhasil ditambahkan.");
    } catch {
      showAlert("error", "Gagal menambahkan reward.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!editItem.id_produk) {
      showAlert("error", "Pilih produk terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put(`/reward-poin/${editItem.id_reward}`, {
        id_produk: Number(editItem.id_produk),
        poin_required: Number(editItem.poin_required),
      });
      await fetchData();
      setEditItem(null);
      showAlert("success", "Reward berhasil diubah.");
    } catch {
      showAlert("error", "Gagal mengubah reward.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus reward "${item.nama_produk}"?`)) return;
    try {
      await api.delete(`/reward-poin/${item.id_reward}`);
      await fetchData();
      showAlert("success", "Reward berhasil dihapus.");
    } catch {
      showAlert("error", "Gagal menghapus reward.");
    }
  };

  return (
    <div className="space-y-3">
      {alert.show && (
        <div
          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div
        className="relative overflow-x-auto shadow-md sm:rounded-lg"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-center">No</th>
              <th className="px-2 py-2">Nama Produk</th>
              <th className="px-2 py-2">Poin</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  Memuat...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-300">
                  Belum ada reward.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id_reward}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-2 py-2 text-center">{idx + 1}</td>
                  <td className="px-2 py-2 font-medium text-gray-800">
                    {item.nama_produk}
                  </td>
                  <td className="px-2 py-2">
                    <span className="bg-[#FFF0F4] text-[#FF4778] font-bold px-3 py-0.5 rounded-full text-xs">
                      {item.poin_required} poin
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditItem({ ...item })}
                        className="bg-[#FF4778] hover:bg-[#FF87A7] text-white p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          setNewItem({ id_produk: "", nama_produk: "", poin_required: "" });
          setAddModalOpen(true);
        }}
        className="bg-[#FF4778] hover:bg-[#FF87A7] text-white px-4 py-2 rounded-[10px] text-xs font-semibold flex items-center gap-2 transition-all duration-200"
      >
        <Plus size={16} /> Tambah Reward
      </button>

      {/* Modal Tambah */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Reward Poin</h2>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Produk
                </label>
                <ProductSearchInput
                  value={{
                    id_produk: newItem.id_produk,
                    nama_produk: newItem.nama_produk,
                  }}
                  onChange={(val) =>
                    setNewItem((prev) => ({ ...prev, ...val }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Poin Dibutuhkan</label>
                <input
                  type="number"
                  value={newItem.poin_required}
                  onChange={(e) =>
                    setNewItem({ ...newItem, poin_required: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full text-sm"
                  required
                  min={1}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1 text-sm rounded-lg bg-[#FF4778] hover:bg-[#FF87A7] text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Reward Poin</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Produk
                </label>
                <ProductSearchInput
                  value={{
                    id_produk: editItem.id_produk,
                    nama_produk: editItem.nama_produk,
                  }}
                  onChange={(val) =>
                    setEditItem((prev) => ({ ...prev, ...val }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Poin Dibutuhkan</label>
                <input
                  type="number"
                  value={editItem.poin_required}
                  onChange={(e) =>
                    setEditItem({ ...editItem, poin_required: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full text-sm"
                  required
                  min={1}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1 text-sm rounded-lg bg-[#FF4778] hover:bg-[#FF87A7] text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: REDEEM POIN
// ─────────────────────────────────────────────
const TabRedeem = () => {
  const [pelangganList, setPelangganList] = useState([]);
  const [rewardList, setRewardList] = useState([]);
  const [selectedPelanggan, setSelectedPelanggan] = useState("");
  const [pelangganInfo, setPelangganInfo] = useState(null);
  const [selectedReward, setSelectedReward] = useState("");
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    Promise.all([api.get("/pelanggan/"), api.get("/reward-poin/")])
      .then(([p, r]) => {
        setPelangganList(p.data.data);
        setRewardList(r.data.data);
      })
      .catch(() => {});
  }, []);

  const handlePelangganChange = async (e) => {
    const id = e.target.value;
    setSelectedPelanggan(id);
    setResult(null);
    if (!id) {
      setPelangganInfo(null);
      return;
    }
    try {
      const res = await api.get(`/pelanggan/${id}/poin`);
      setPelangganInfo(res.data.data);
    } catch {
      setPelangganInfo(null);
    }
  };

  const selectedRewardData = rewardList.find(
    (r) => String(r.id_reward) === String(selectedReward)
  );
  const totalPoin = selectedRewardData
    ? selectedRewardData.poin_required * qty
    : 0;

  const handleRedeem = async () => {
    if (!selectedPelanggan || !selectedReward || qty < 1) {
      showAlert("error", "Lengkapi semua field.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await api.post(
        `/pelanggan/${selectedPelanggan}/redeem-poin`,
        { id_reward: Number(selectedReward), qty: Number(qty) }
      );
      setResult(res.data.data);
      setPelangganInfo((prev) =>
        prev ? { ...prev, poin: res.data.data.sisa_poin } : prev
      );
      showAlert("success", "Redeem berhasil!");
    } catch (err) {
      showAlert(
        "error",
        err?.response?.data?.message || "Redeem gagal. Cek poin atau stok."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 max-w-lg">
      {alert.show && (
        <div
          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Pelanggan
        </label>
        <SearchableCombobox
          value={selectedPelanggan}
          onChange={(val) => {
            handlePelangganChange({
              target: { value: val },
            });
          }}
          options={pelangganList.map((p) => ({
            value: p.id_pelanggan,
            label: p.nama_pelanggan,
          }))}
          placeholder="Cari pelanggan..."
        />
      </div>

      {pelangganInfo && (
        <div className="flex items-center gap-2 bg-[#FFF0F4] border border-[#FF4778] rounded-[12px] px-4 py-2 text-sm">
          <Gift size={16} className="text-[#FF4778]" />
          <span className="font-semibold text-gray-700">
            {pelangganInfo.nama_pelanggan}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-[#FF4778] font-bold">
            {pelangganInfo.poin} Poin
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Reward
        </label>
        <SearchableCombobox
          value={selectedReward}
          onChange={(val) => {
            setSelectedReward(val);
            setResult(null);
          }}
          options={rewardList.map((r) => ({
            value: r.id_reward,
            label: `${r.nama_produk} — ${r.poin_required} poin`,
          }))}
          placeholder="Cari reward..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Jumlah (Qty)
        </label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => {
            setQty(e.target.value);
            setResult(null);
          }}
          className="border border-gray-300 rounded-[10px] px-3 py-2 text-sm w-full focus:ring-[#FF4778] focus:border-[#FF4778] outline-none"
        />
      </div>

      {selectedRewardData && qty >= 1 && (
        <div className="bg-gray-50 border border-gray-200 rounded-[12px] px-4 py-3 text-sm text-gray-700 space-y-1">
          <div className="flex justify-between">
            <span>Reward:</span>
            <span className="font-semibold">
              {selectedRewardData.nama_produk}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Poin/item:</span>
            <span>{selectedRewardData.poin_required}</span>
          </div>
          <div className="flex justify-between">
            <span>Qty:</span>
            <span>{qty}</span>
          </div>
          <div className="flex justify-between font-bold text-[#FF4778] border-t pt-1">
            <span>Total Poin:</span>
            <span>{totalPoin} poin</span>
          </div>
        </div>
      )}

      <button
        onClick={handleRedeem}
        disabled={isSubmitting || !selectedPelanggan || !selectedReward}
        className="w-full bg-[#FF4778] hover:bg-[#FF87A7] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
      >
        <RefreshCcw size={16} />
        {isSubmitting ? "Memproses..." : "Redeem Sekarang"}
      </button>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-[12px] px-4 py-3 text-sm text-green-800 space-y-1">
          <p className="font-bold">✅ Redeem Berhasil!</p>
          <div className="flex justify-between">
            <span>Produk:</span>
            <span>{result.nama_produk}</span>
          </div>
          <div className="flex justify-between">
            <span>Qty:</span>
            <span>{result.qty}</span>
          </div>
          <div className="flex justify-between">
            <span>Poin digunakan:</span>
            <span className="text-red-500 font-semibold">
              -{result.poin_digunakan}
            </span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>Sisa Poin:</span>
            <span className="text-[#FF4778]">{result.sisa_poin} poin</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: PENGATURAN POIN
// ─────────────────────────────────────────────
const TabPengaturan = () => {
  const [poinKelipatan, setPoinKelipatan] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    setLoading(true);
    api
      .get("/pengaturan/")
      .then((res) => {
        const val = String(res.data.data.poin_kelipatan);
        setPoinKelipatan(val);
        setOriginalValue(val);
      })
      .catch(() => showAlert("error", "Gagal mengambil pengaturan."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !poinKelipatan || Number(poinKelipatan) < 1) return;
    setIsSubmitting(true);
    try {
      await api.put("/pengaturan/", { poin_kelipatan: Number(poinKelipatan) });
      setOriginalValue(poinKelipatan);
      showAlert("success", "Pengaturan berhasil disimpan.");
    } catch {
      showAlert("error", "Gagal menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = poinKelipatan !== originalValue;
  const previewRows = [1, 2, 3, 4].map((m) => ({
    belanja: Number(poinKelipatan || 35000) * m,
    poin: m,
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {alert.show && (
        <div
          className={`fixed top-4 left-1/2 z-[9999] -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-sm font-semibold ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ minWidth: 220, textAlign: "center" }}
        >
          {alert.message}
        </div>
      )}

      {/* Form */}
      <div className="w-full sm:max-w-sm space-y-4">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-[#FF4778]" />
          <p className="text-sm font-semibold">Aturan Poin</p>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Memuat...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Kelipatan Belanja per Poin (Rp)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm pointer-events-none">
                  Rp
                </span>
                <input
                  type="number"
                  min={1}
                  value={poinKelipatan}
                  onChange={(e) => setPoinKelipatan(e.target.value)}
                  className="border border-gray-300 rounded-[10px] pl-9 pr-3 py-2 text-sm w-full focus:ring-[#FF4778] focus:border-[#FF4778] outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Setiap Rp{Number(poinKelipatan || 0).toLocaleString("id-ID")} =
                1 poin
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full bg-[#FF4778] hover:bg-[#FF87A7] disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save size={15} />{" "}
              {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            {!isDirty && !loading && (
              <p className="text-xs text-center text-gray-400">
                Tidak ada perubahan.
              </p>
            )}
          </form>
        )}
      </div>

      {/* Preview */}
      <div className="w-full sm:max-w-xs">
        <p className="text-sm font-semibold mb-3">Preview Perhitungan</p>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-3 py-2">Total Belanja</th>
              <th className="px-3 py-2 text-center">Poin</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  Rp{row.belanja.toLocaleString("id-ID")}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="bg-[#FFF0F4] text-[#FF4778] font-bold px-2 py-0.5 rounded-full text-xs">
                    {row.poin}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="border-b bg-gray-50 text-xs text-gray-400">
              <td className="px-3 py-2 italic">
                Rp
                {Math.floor(
                  Number(poinKelipatan || 35000) * 0.8
                ).toLocaleString("id-ID")}{" "}
                (tidak cukup)
              </td>
              <td className="px-3 py-2 text-center font-bold">0</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2">
          * Berlaku kelipatan. Sisa belanja tidak dihitung.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const role = localStorage.getItem("role");

const TABS = [
  {
    key: "histori",
    label: "Histori Poin",
    icon: <History size={16} />,
    roles: ["admin", "kasir"],
  },
  {
    key: "redeem",
    label: "Redeem Poin",
    icon: <RefreshCcw size={16} />,
    roles: ["admin", "kasir"],
  },
  {
    key: "reward",
    label: "Reward Poin",
    icon: <Gift size={16} />,
    roles: ["admin"],
  },
  {
    key: "pengaturan",
    label: "Pengaturan",
    icon: <Settings size={16} />,
    roles: ["admin"],
  },
].filter((t) => t.roles.includes(role));

const LoyaltyPoin = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]?.key || "histori");

  return (
    <div className="">
      <h1 className="text-2xl font-bold pb-2">Loyalty Poin</h1>
      <div className="bg-white rounded-[20px] py-4 px-6 shadow-md">
        {/* Tab Header */}
        <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px]
                ${
                  activeTab === tab.key
                    ? "border-[#FF4778] text-[#FF4778] bg-[#FFF0F4]"
                    : "border-transparent text-gray-500 hover:text-[#FF4778] hover:bg-gray-50"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "histori" && <TabHistori />}
        {activeTab === "reward" && <TabReward />}
        {activeTab === "redeem" && <TabRedeem />}
        {activeTab === "pengaturan" && <TabPengaturan />}
      </div>
    </div>
  );
};

export default LoyaltyPoin;
