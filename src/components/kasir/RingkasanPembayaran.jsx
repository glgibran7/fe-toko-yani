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
    <div className="flex justify-end mt-4">
      <div className="flex flex-col md:flex-row gap-8 justify-between mt-2">
        {/* Kolom kiri: subtotal, diskon, total */}
        <div className="space-y-4 w-full md:w-1/2 pr-4">
          <div className="flex justify-between">
            <label className="text-sm text-black pr-2">SubTotal</label>
            <input
              type="text"
              value={`Rp. ${subtotal.toLocaleString("id-ID")}`}
              className="text-xl text-end border border-black rounded-lg px-2 w-40"
              readOnly
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm text-black pr-2">Diskon</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={0}
                value={diskonValue}
                onChange={(e) => setDiskonValue(e.target.value)}
                className="text-xl text-end border border-black rounded-lg px-2 w-24"
                placeholder="Diskon"
              />
              <select
                value={diskonType}
                onChange={(e) => setDiskonType(e.target.value)}
                className="text-md border border-black rounded-lg px-2 py-1"
              >
                <option value="persen">%</option>
                <option value="nominal">Rp</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <label className="text-sm text-black font-semibold pr-2">
              Total
            </label>
            <input
              type="text"
              value={`Rp. ${total.toLocaleString("id-ID")}`}
              className="text-xl text-end border border-black rounded-lg px-2 w-40 font-semibold"
              readOnly
            />
          </div>
        </div>

        {/* Kolom kanan: bayar, kembalian, pelanggan, tombol */}
        <div className="space-y-4 w-full md:w-1/2 pr-4">
          <div className="flex justify-between">
            <label className="text-sm text-black pr-2">Bayar</label>
            <input
              ref={bayarInputRef}
              type="text"
              inputMode="numeric"
              min={0}
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
              className="text-xl text-end border border-black rounded-lg px-2 w-40"
            />
          </div>

          <div className="flex justify-between">
            <label
              className={`text-sm pr-2 font-semibold ${
                kembalian < 0 ? "text-red-700" : "text-green-700"
              }`}
            >
              {kembalian < 0 ? "Hutang" : "Kembalian"}
            </label>
            <input
              type="text"
              value={
                kembalian < 0
                  ? `Rp. ${Math.abs(kembalian).toLocaleString("id-ID")}`
                  : `Rp. ${kembalian.toLocaleString("id-ID")}`
              }
              className={`text-xl text-end border border-black rounded-lg px-2 w-40 ${
                kembalian < 0 ? "text-red-700" : "text-green-700"
              }`}
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs">Nama Pelanggan</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                name="nama"
                value={newItem.nama_pelanggan}
                className="border border-black rounded-lg px-2 py-1 w-full pr-10 capitalize text-xl"
                placeholder="pilih pelanggan...."
              />
              <button
                type="button"
                className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500 text-xs underline hover:text-red-700"
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
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600"
                title="Pilih dari daftar pelanggan"
                onClick={openKontakModal}
              >
                <MdContactPage size={25} />
              </button>
            </div>
          </div>

          <div className="text-center mt-1 space-x-2">
            <button
              className="bg-gray-600 text-sm text-white px-4 py-2 rounded-[10px] w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:shadow-lg"
              type="button"
              onClick={handleSubmitTanpaCetakStruk}
            >
              Simpan
            </button>
            <button
              className="bg-black text-sm text-white px-4 py-2 rounded-[10px] w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
              type="button"
              onClick={handleSubmitTransaksi}
            >
              Simpan & Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingkasanPembayaran;
