import React, { useRef, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";

const TabelPembelian = ({
  dataPembelian,
  handlePembelianChange,
  handleHapusPembelian,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [dataPembelian]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 max-h-[72px]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Pembelian
          </h2>
          <p className="text-sm text-gray-500">
            Produk yang sedang dibeli pelanggan
          </p>
        </div>

        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {dataPembelian.length} Item
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="overflow-auto max-h-[500px]">
        {dataPembelian.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-3xl">🛒</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-700">
              Belum Ada Produk
            </h3>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              Silahkan scan barcode atau tambahkan produk ke transaksi
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
              <tr className="text-sm text-gray-600">
                <th className="px-4 py-3 text-left font-semibold">Produk</th>

                <th className="px-4 py-3 text-center font-semibold w-[120px]">
                  Qty
                </th>

                <th className="px-4 py-3 text-left font-semibold w-[120px]">
                  Satuan
                </th>

                <th className="px-4 py-3 text-right font-semibold w-[160px]">
                  Harga
                </th>

                <th className="px-4 py-3 text-center font-semibold w-[100px]">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {dataPembelian.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* PRODUCT */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 capitalize">
                        {item.nama_produk}
                      </span>

                      {item.barcode && (
                        <span className="text-xs text-gray-400 mt-1">
                          {item.barcode}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* QTY */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        handlePembelianChange(index, "qty", e.target.value)
                      }
                      className="
                        w-20
                        rounded-xl
                        border
                        border-gray-300
                        px-2
                        py-2
                        text-center
                        font-medium
                        focus:outline-none
                        focus:ring-2
                        focus:ring-black
                      "
                    />
                  </td>

                  {/* UNIT */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-700">
                      {item.satuan}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-gray-800">
                        Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                      </span>

                      <span className="text-xs text-gray-400 mt-1">
                        Total: Rp{" "}
                        {(
                          Number(item.qty) * Number(item.harga_jual)
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleHapusPembelian(index)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-50
                        hover:bg-red-100
                        text-red-600
                        p-2
                        transition-all
                        duration-200
                      "
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}

              <tr ref={bottomRef}></tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TabelPembelian;
