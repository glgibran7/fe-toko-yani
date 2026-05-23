import React, { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const ModalDaftarBarang = ({
  barangModalOpen,
  setBarangModalOpen,
  userRole,
  selectedLokasi,
  setSelectedLokasi,
  lokasiList,
  searchProduk,
  handleSearchProdukChange,
  produkLoading,
  produkError,
  filteredProdukList,
  setDataPembelian,
}) => {
  const modalSearchRef = useRef(null);

  useEffect(() => {
    if (barangModalOpen && modalSearchRef.current) {
      modalSearchRef.current.focus();
    }
  }, [barangModalOpen]);

  if (!barangModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-[1000px] shadow-lg relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Daftar Barang</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setBarangModalOpen(false)}
          >
            <IoClose size={28} />
          </button>
        </div>

        <form className="flex items-center gap-2 mb-4">
          {userRole === "admin" && (
            <div className="mb-2">
              <label className="text-xs">Pilih Lokasi</label>
              <select
                value={selectedLokasi}
                onChange={(e) => setSelectedLokasi(e.target.value)}
                className="border rounded-[10px] px-2 py-0.5 text-sm w-full capitalize text-gray-900 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">-- Semua Lokasi --</option>
                {lokasiList.map((lokasi) => (
                  <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                    {lokasi.nama_lokasi}
                  </option>
                ))}
              </select>
            </div>
          )}
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              ref={modalSearchRef}
              type="search"
              className="block w-50 p-2 ps-10 text-sm text-gray-900 border border-black rounded-[15px] bg-gray-50 focus:ring-green-500 focus:border-green-500"
              placeholder="Cari barang..."
              value={searchProduk}
              onChange={handleSearchProdukChange}
            />
          </div>
        </form>

        <div
          className="relative overflow-x-auto shadow-md sm:rounded-lg"
          style={{ maxHeight: "450px", overflowY: "auto" }}
        >
          {produkLoading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : produkError ? (
            <div className="text-center text-red-500 py-8">{produkError}</div>
          ) : (
            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs text-black font-bold uppercase bg-gray-50 z-50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-center">No</th>
                  <th className="px-2 py-1.5 text-center">Barcode</th>
                  <th className="px-2 py-1.5">Nama Produk</th>
                  <th className="px-2 py-1.5">Kategori</th>
                  <th className="px-2 py-1.5">Satuan</th>
                  <th className="px-2 py-1.5">Harga Jual</th>
                  <th className="px-2 py-1.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdukList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-8">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredProdukList.map((item, idx) => (
                    <tr key={item.id_produk} className="bg-white border-b">
                      <td className="px-2 py-1.5 text-center">{idx + 1}</td>
                      <td className="px-2 py-1.5 text-center">
                        {item.barcode}
                      </td>
                      <td className="px-2 py-1.5 capitalize">
                        {item.nama_produk.length > 30
                          ? item.nama_produk.slice(0, 30) + "…"
                          : item.nama_produk}
                      </td>
                      <td className="px-2 py-1.5 capitalize">
                        {item.kategori}
                      </td>
                      <td className="px-2 py-1.5 capitalize">{item.satuan}</td>
                      <td className="px-2 py-1.5 capitalize">
                        Rp.{item.harga_jual}
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          onClick={() => {
                            setDataPembelian((prev) => {
                              const idx = prev.findIndex(
                                (b) =>
                                  b.id_produk === item.id_produk &&
                                  b.satuan === item.satuan
                              );
                              if (idx !== -1) {
                                return prev.map((b, i) =>
                                  i === idx
                                    ? { ...b, qty: Number(b.qty) + 1 }
                                    : b
                                );
                              }
                              return [
                                ...prev,
                                {
                                  id_produk: item.id_produk,
                                  nama_produk: item.nama_produk,
                                  qty: 1,
                                  satuan: item.satuan,
                                  harga_jual: item.harga_jual,
                                },
                              ];
                            });
                            setBarangModalOpen(false);
                          }}
                          className="bg-[#FF4778] hover:bg-green-600 text-white px-3 py-1 rounded-[10px] text-xs"
                        >
                          Pilih
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDaftarBarang;
