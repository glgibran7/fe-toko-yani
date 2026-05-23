import React from "react";
import { IoClose } from "react-icons/io5";
import {
  getTodayRange,
  getMonthRange,
  getYearRange,
} from "../../utils/dateRange";

const ModalHistoryTransaksi = ({
  lihatHistoryTransaksiOpen,
  closeLihatHistoryTransaksi,
  userRole,
  lokasiList,
  filterHistoryTransaksi,
  setFilterHistoryTransaksi,
  handleFilterRiwayatTransaksiChange,
  historyTransaksiList,
  loadingHistoryTransaksi,
  dataHistoryTransaksi,
  openDetailTransaksi,
}) => {
  if (!lihatHistoryTransaksiOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Data Transaksi</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeLihatHistoryTransaksi}
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          {userRole === "admin" && (
            <select
              name="id_lokasi"
              value={filterHistoryTransaksi.id_lokasi}
              onChange={handleFilterRiwayatTransaksiChange}
              className="border rounded px-2 py-1 text-xs capitalize"
            >
              <option value="">Pilih Lokasi</option>
              {lokasiList.map((lokasi) => (
                <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                  {lokasi.nama_lokasi}
                </option>
              ))}
            </select>
          )}

          <select
            className="border rounded px-2 py-1 text-xs"
            value={
              filterHistoryTransaksi.tanggal_awal ===
                getTodayRange().tanggal_awal &&
              filterHistoryTransaksi.tanggal_akhir ===
                getTodayRange().tanggal_akhir
                ? "today"
                : filterHistoryTransaksi.tanggal_awal ===
                    getMonthRange().tanggal_awal &&
                  filterHistoryTransaksi.tanggal_akhir ===
                    getMonthRange().tanggal_akhir
                ? "month"
                : filterHistoryTransaksi.tanggal_awal ===
                    getYearRange().tanggal_awal &&
                  filterHistoryTransaksi.tanggal_akhir ===
                    getYearRange().tanggal_akhir
                ? "year"
                : ""
            }
            onChange={(e) => {
              let range = {};
              if (e.target.value === "today") range = getTodayRange();
              else if (e.target.value === "month") range = getMonthRange();
              else if (e.target.value === "year") range = getYearRange();
              setFilterHistoryTransaksi((prev) => ({ ...prev, ...range }));
            }}
          >
            <option value="">Pilih Periode</option>
            <option value="today">Hari ini</option>
            <option value="month">Bulan ini</option>
            <option value="year">Tahun ini</option>
          </select>

          <input
            type="date"
            className="border rounded px-2 py-1 text-xs"
            value={filterHistoryTransaksi.tanggal_awal}
            onChange={(e) =>
              setFilterHistoryTransaksi((prev) => ({
                ...prev,
                tanggal_awal: e.target.value,
                tanggal_akhir: e.target.value,
              }))
            }
          />

          <select
            name="id_pelanggan"
            value={filterHistoryTransaksi.id_pelanggan}
            onChange={handleFilterRiwayatTransaksiChange}
            className="border rounded px-2 py-1 text-xs capitalize"
          >
            <option value="">Pilih Pelanggan</option>
            {historyTransaksiList.map((pelanggan) => (
              <option
                key={pelanggan.id_pelanggan}
                value={pelanggan.id_pelanggan}
              >
                {pelanggan.nama_pelanggan || "Tidak ada nama"}
              </option>
            ))}
          </select>
        </div>

        <div
          className="relative overflow-x-auto"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {loadingHistoryTransaksi ? (
            <div className="text-center py-8">Memuat data transaksi...</div>
          ) : dataHistoryTransaksi.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Tidak ada data transaksi
            </div>
          ) : (
            <table className="w-full text-sm text-left text-black">
              <thead>
                <tr>
                  <th className="px-2 py-1">Tanggal</th>
                  <th className="px-2 py-1">Nama Pelanggan</th>
                  <th className="px-2 py-1">Lokasi</th>
                  <th className="px-2 py-1">Total Belanja</th>
                  <th className="px-2 py-1">Status Hutang</th>
                  <th className="px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataHistoryTransaksi.map((item, idx) => (
                  <tr key={idx} className="bg-gray-100">
                    <td className="px-2 py-1">{item.tanggal}</td>
                    <td className="px-2 py-1 capitalize">
                      {item.nama_pelanggan || "-"}
                    </td>
                    <td className="px-2 py-1 capitalize">{item.nama_lokasi}</td>
                    <td className="px-2 py-1">{`Rp. ${item.total.toLocaleString(
                      "id-ID"
                    )}`}</td>
                    <td className="px-2 py-1 capitalize">
                      <span
                        className={
                          !item.status_hutang || item.status_hutang === "-"
                            ? "text-black font-semibold"
                            : item.status_hutang.toLowerCase() === "lunas"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {item.status_hutang || "-"}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <button
                        className="bg-[#FF4778] hover:bg-[#FF87A7] text-white px-3 py-1 rounded-[10px] text-xs"
                        onClick={() => openDetailTransaksi(item.id_transaksi)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalHistoryTransaksi;
