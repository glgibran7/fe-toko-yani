import React from "react";
import api from "../../utils/api";
import { getAuthHeaders } from "../../utils/kasirHelpers";

const ModalTambahPelanggan = ({
  tambahPelangganModalOpen,
  setTambahPelangganModalOpen,
  tambahNamaPelanggan,
  setTambahNamaPelanggan,
  tambahAlamatPelanggan,
  setTambahAlamatPelanggan,
  tambahKontakPelanggan,
  setTambahKontakPelanggan,
  kontakModalOpen,
  setPelangganLoading,
  setPelangganList,
}) => {
  if (!tambahPelangganModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-bold mb-4">Tambah Pelanggan</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.post(
                "/pelanggan/",
                {
                  nama_pelanggan: tambahNamaPelanggan,
                  alamat: tambahAlamatPelanggan,
                  kontak: tambahKontakPelanggan,
                },
                { headers: getAuthHeaders() }
              );
              setTambahPelangganModalOpen(false);
              setTambahNamaPelanggan("");
              setTambahAlamatPelanggan("");
              setTambahKontakPelanggan("");
              if (kontakModalOpen) {
                setPelangganLoading(true);
                api
                  .get("/pelanggan/", { headers: getAuthHeaders() })
                  .then((res) => setPelangganList(res.data.data || []))
                  .finally(() => setPelangganLoading(false));
              }
            } catch (err) {
              alert("Gagal menambah pelanggan!");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs mb-1">Nama Pelanggan</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              required
              value={tambahNamaPelanggan}
              onChange={(e) => setTambahNamaPelanggan(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Alamat</label>
            <textarea
              className="border rounded px-2 py-1 w-full resize-none"
              rows={2}
              value={tambahAlamatPelanggan}
              onChange={(e) => setTambahAlamatPelanggan(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Kontak</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={tambahKontakPelanggan}
              onChange={(e) => setTambahKontakPelanggan(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTambahPelangganModalOpen(false)}
              className="text-sm px-4 py-1 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1 text-sm rounded-[10px] bg-[#FF4778] hover:bg-[#FF87A7] text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahPelanggan;
