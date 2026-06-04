import React from "react";
import { MdContactPage } from "react-icons/md";

const RingkasanPembayaran = ({
  subtotal,
  diskonValue,
  setDiskonValue,
  diskonType,
  setDiskonType,
  total,
  bayar,
  handleBayarChange,
  kembalian,
  newItem,
  setNewItem,
  openKontakModal,
  handleSubmitTransaksi,
  handleSubmitTanpaCetakStruk,
  bayarInputRef,
}) => {
  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Ringkasan Pembayaran
            </h2>
            <p className="text-sm text-gray-500">
              Detail subtotal, diskon, dan total pembayaran
            </p>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between gap-5">
            <label className="text-sm font-medium text-gray-600">
              Subtotal
            </label>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 min-w-[180px] text-right">
              <span className="text-lg font-semibold text-gray-800">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Diskon */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-600">Diskon</label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={diskonValue}
                onChange={(e) => setDiskonValue(e.target.value)}
                placeholder="0"
                className="w-28 rounded-xl border border-gray-300 px-3 py-2 text-right text-lg focus:outline-none focus:ring-2 focus:ring-black"
              />

              <select
                value={diskonType}
                onChange={(e) => setDiskonType(e.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="persen">%</option>
                <option value="nominal">Rp</option>
              </select>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <label className="text-base font-semibold text-gray-800">
              Total
            </label>

            <div className="bg-black rounded-2xl px-5 py-3 min-w-[200px] text-right shadow-md">
              <span className="text-2xl font-bold text-white">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Pembayaran</h2>
            <p className="text-sm text-gray-500">
              Input pembayaran dan pelanggan
            </p>
          </div>

          {/* Bayar */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-600">Bayar</label>

            <input
              ref={bayarInputRef}
              type="text"
              inputMode="numeric"
              value={bayar.toLocaleString("id-ID")}
              onChange={handleBayarChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  if (e.shiftKey) {
                    handleSubmitTanpaCetakStruk();
                  } else {
                    handleSubmitTransaksi();
                  }
                }
              }}
              className="w-[220px] rounded-xl border border-gray-300 px-4 py-3 text-right text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
            />
          </div>

          {/* Kembalian */}
          <div className="flex items-center justify-between gap-4">
            <label
              className={`text-sm font-semibold ${
                kembalian < 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {kembalian < 0 ? "Hutang" : "Kembalian"}
            </label>

            <div
              className={`rounded-2xl px-5 py-3 min-w-[220px] text-right border ${
                kembalian < 0
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <span
                className={`text-2xl font-bold ${
                  kembalian < 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                Rp {Math.abs(kembalian).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Nama Pelanggan
            </label>

            <div className="relative">
              <input
                type="text"
                readOnly
                name="nama"
                value={newItem.nama_pelanggan}
                placeholder="Pilih pelanggan..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-24 text-lg capitalize focus:outline-none"
              />

              {newItem.nama_pelanggan && (
                <button
                  type="button"
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-red-500 hover:text-red-700"
                  onClick={() =>
                    setNewItem({
                      ...newItem,
                      id_pelanggan: null,
                      nama_pelanggan: "",
                      kontak: "",
                    })
                  }
                >
                  Hapus
                </button>
              )}

              <button
                type="button"
                title="Pilih pelanggan"
                onClick={openKontakModal}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition"
              >
                <MdContactPage size={24} />
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmitTanpaCetakStruk}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 transition-all duration-200"
            >
              Simpan
            </button>

            <button
              type="button"
              onClick={handleSubmitTransaksi}
              className="rounded-xl bg-black hover:bg-gray-900 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Simpan & Cetak
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="text-xs text-gray-400 text-center pt-2">
            Enter = Simpan & Cetak • Shift + Enter = Simpan
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingkasanPembayaran;
