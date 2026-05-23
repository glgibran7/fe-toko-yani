import React from "react";
import { IoClose } from "react-icons/io5";

const ModalDetailTransaksi = ({
  detailTransaksiOpen,
  detailTransaksiData,
  closeDetailTransaksi,
}) => {
  if (!detailTransaksiOpen || !detailTransaksiData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Detail Transaksi</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeDetailTransaksi}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">ID Transaksi:</span>{" "}
            {detailTransaksiData.id_transaksi}
          </div>
          <div>
            <span className="font-semibold">Tanggal:</span>{" "}
            {detailTransaksiData.tanggal}
          </div>
          <div>
            <span className="font-semibold">Kasir:</span>{" "}
            {detailTransaksiData.username}
          </div>
          <div>
            <span className="font-semibold">Lokasi:</span>{" "}
            {detailTransaksiData.nama_lokasi}
          </div>
          <div>
            <span className="font-semibold">Pelanggan:</span>{" "}
            {detailTransaksiData.nama_pelanggan || "-"}
          </div>
          <div>
            <span className="font-semibold">Total:</span> Rp.{" "}
            {detailTransaksiData.total?.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-semibold">Tunai:</span> Rp.{" "}
            {detailTransaksiData.tunai?.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-semibold">Kembalian:</span> Rp.{" "}
            {detailTransaksiData.kembalian?.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-semibold">Sisa Hutang:</span> Rp.{" "}
            {detailTransaksiData.sisa_hutang?.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-semibold">Status Hutang:</span>{" "}
            {detailTransaksiData.status_hutang || "-"}
          </div>
          <div>
            <span className="font-semibold">Total Hutang Pelanggan:</span> Rp.{" "}
            {detailTransaksiData.total_hutang?.toLocaleString("id-ID")}
          </div>
          <div>
            <span className="font-semibold">Item:</span>
            <ul className="list-disc ml-5">
              {detailTransaksiData.items?.map((itm, i) => (
                <li key={i}>
                  {itm.nama_produk} ({itm.qty} x Rp.
                  {itm.harga_jual?.toLocaleString("id-ID")})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-1 text-sm rounded-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={closeDetailTransaksi}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailTransaksi;
