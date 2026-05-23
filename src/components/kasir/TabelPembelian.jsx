import React, { useRef, useEffect } from "react";

const TabelPembelian = ({
  dataPembelian,
  handlePembelianChange,
  handleHapusPembelian,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dataPembelian]);

  return (
    <div className="bg-white h-[450px] rounded-lg p-2 shadow-md border border-[#FF4778]">
      <div
        className="relative overflow-x-auto"
        style={{ maxHeight: "450px", overflowY: "auto" }}
      >
        {dataPembelian.length === 0 ? (
          <div className="text-center text-gray-400 py-[225px]">
            Silahkan scan produk yang dibeli
          </div>
        ) : (
          <table className="w-full text-sm text-left text-black">
            <thead className="bg-red-200 text-black sticky top-0 z-10">
              <tr>
                <th className="px-0.5 py-1 text-center">Produk</th>
                <th className="px-0.5 py-1 text-left">Qty</th>
                <th className="px-0.5 py-1 text-left">Satuan</th>
                <th className="px-0.5 py-1 text-left">Harga</th>
                <th className="px-0.5 py-1 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPembelian.map((item, id_produk) => (
                <tr key={id_produk} className="bg-gray-200">
                  <td className="px-0.5 py-0.5 capitalize">
                    {item.nama_produk.length > 30
                      ? item.nama_produk.slice(0, 30) + "…"
                      : item.nama_produk}
                  </td>
                  <td className="px-0.5 py-0.5">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        handlePembelianChange(id_produk, "qty", e.target.value)
                      }
                      className="w-16 border rounded px-1 py-0.5 text-center"
                    />
                  </td>
                  <td className="px-0.5 py-0.5 capitalize">{item.satuan}</td>
                  <td className="px-0.5 py-0.5">Rp.{item.harga_jual}</td>
                  <td className="px-0.5 py-0.5">
                    <button
                      className="bg-white hover:bg-gray-300 text-black px-2 py-1 rounded text-xs"
                      onClick={() => handleHapusPembelian(id_produk)}
                    >
                      Hapus
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
