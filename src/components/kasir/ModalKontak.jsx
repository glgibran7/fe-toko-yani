import React from "react";

const ModalKontak = ({
  kontakModalOpen,
  closeKontakModal,
  searchPelanggan,
  setSearchPelanggan,
  openTambahPelangganModal,
  pelangganLoading,
  pelangganError,
  filteredPelangganList,
  setNewItem,
  setKontakModalOpen,
  newItem,
}) => {
  if (!kontakModalOpen) return null;

  console.log("filteredPelangganList:", filteredPelangganList);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-bold mb-4">Daftar Pelanggan</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari pelanggan..."
            className="border rounded-lg px-2 py-1 w-full"
            value={searchPelanggan}
            onChange={(e) => setSearchPelanggan(e.target.value)}
          />
          <button
            type="button"
            className="bg-green-400 hover:bg-green-500 text-white px-3 py-2 rounded-[10px] text-xs"
            onClick={openTambahPelangganModal}
          >
            Tambah
          </button>
        </div>

        <div
          className="space-y-3 mb-4"
          style={{ maxHeight: 300, overflowY: "auto" }}
        >
          {pelangganLoading ? (
            <div className="text-center py-4">Memuat data...</div>
          ) : pelangganError ? (
            <div className="text-center text-red-500 py-4">
              {pelangganError}
            </div>
          ) : filteredPelangganList.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              Tidak ada data pelanggan
            </div>
          ) : (
            filteredPelangganList.slice(0, 10).map((item) => (
              <div
                key={item.id_pelanggan}
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-4 py-3 shadow-sm bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-sm capitalize">
                    {item.nama_pelanggan}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.kontak || "Tidak ada kontak"}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 md:mt-0 bg-[#FF4778] hover:bg-[#FF87A7] text-white px-4 py-1 rounded-[10px] text-xs"
                  onClick={() => {
                    setNewItem((prev) => ({
                      ...prev,
                      id_pelanggan: item.id_pelanggan,
                      kontak: item.kontak || "",
                      nama_pelanggan: item.nama_pelanggan,
                    }));
                    setKontakModalOpen(false);
                  }}
                >
                  Pilih
                </button>
              </div>
            ))
          )}
          {filteredPelangganList.length > 10 && (
            <div className="text-xs text-gray-400 text-center">
              Menampilkan 10 data pertama dari {filteredPelangganList.length}{" "}
              hasil
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={closeKontakModal}
            className="text-sm px-4 py-1 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalKontak;
