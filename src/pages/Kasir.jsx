import React, { useEffect, useRef } from "react";
import api from "../utils/api";
import { IoQrCodeOutline } from "react-icons/io5";

import { getAuthHeaders, capitalizeWords } from "../utils/kasirHelpers";
import { useKasirState } from "../hooks/kasir/useKasirState";
import { useTransaksi } from "../hooks/kasir/useTransaksi";
import { useHistoryTransaksi } from "../hooks/kasir/useHistoryTransaksi";

import TabelPembelian from "../components/kasir/TabelPembelian";
import RingkasanPembayaran from "../components/kasir/RingkasanPembayaran";
import ModalKontak from "../components/kasir/ModalKontak";
import ModalTambahPelanggan from "../components/kasir/ModalTambahPelanggan";
import ModalDaftarBarang from "../components/kasir/ModalDaftarBarang";
import ModalHistoryTransaksi from "../components/kasir/ModalHistoryTransaksi";
import ModalDetailTransaksi from "../components/kasir/ModalDetailTransaksi";

const Kasir = () => {
  const s = useKasirState();

  const strukRef = useRef(null);
  const scanInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const bayarInputRef = useRef(null);

  // ── Print struk ────────────────────────────────────────────────────────────
  // Kasir.jsx
  const handlePrintStruk = (totalHutangFinal = s.totalHutangPelanggan) => {
    const tanggalStr = new Date().toLocaleString("id-ID");
    const alamatToko = "Dusun Muhajirin, Desa Nusa Jaya";

    // Build item rows
    const itemRows = s.dataPembelian
      .map(
        (item) => `
    <div class="item-row">
      <div class="item-name">${capitalizeWords(item.nama_produk)}</div>
      <div class="item-info">
        <span>${item.qty} x Rp.${Number(item.harga_jual).toLocaleString(
          "id-ID"
        )}</span>
        <span>Rp.${(item.qty * item.harga_jual).toLocaleString("id-ID")}</span>
      </div>
    </div>
  `
      )
      .join("");

    // Build total section
    const diskonSection =
      s.diskon > 0
        ? `
    <div class="item-info"><span>SubTotal :</span><span>Rp.${s.subtotal.toLocaleString(
      "id-ID"
    )}</span></div>
    <div class="item-info"><span>Diskon :</span><span>Rp.${s.diskon.toLocaleString(
      "id-ID"
    )}</span></div>
  `
        : "";

    const hutangSection = s.newItem.nama_pelanggan
      ? `
    <div class="item-info"><span>Pelanggan :</span><span>${capitalizeWords(
      s.newItem.nama_pelanggan
    )}</span></div>
    ${
      totalHutangFinal !== null
        ? `
      <div class="item-info">
        <span>Total Hutang :</span>
        <span>Rp.${Number(totalHutangFinal).toLocaleString("id-ID")}</span>
      </div>`
        : ""
    }
  `
      : "";

    const printContents = `
    ${itemRows}
    <div class="total-section">
      ${diskonSection}
      <div class="item-info"><span>Total :</span><span>Rp.${s.total.toLocaleString(
        "id-ID"
      )}</span></div>
      <div class="item-info"><span>Bayar :</span>
        <span>${
          s.bayarNominal === 0
            ? "-"
            : `Rp.${s.bayarNominal.toLocaleString("id-ID")}`
        }</span>
      </div>
      <div class="item-info" style="color:${s.kembalian < 0 ? "red" : "black"}">
        <span>${s.kembalian < 0 ? "Hutang :" : "Kembali :"}</span>
        <span>Rp.${Math.abs(s.kembalian).toLocaleString("id-ID")}</span>
      </div>
      ${hutangSection}
    </div>
  `;

    const printWindow = window.open("", "", "width=300,height=600");
    const logoBase64 = "images/icon-outlook.svg";

    printWindow.document.write(`
<html>
  <head>
    <title>Struk Belanja</title>
    <style>
      @media print { body { margin: 0; padding: 0; } }
      body { font-family: monospace, Poppins, sans-serif; font-size: 18px; margin: 0; padding: 0; background: #fff; color: #000; }
      .struk { width: 58mm; max-width: 58mm; margin: 0 auto; padding: 2px; box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word; }
      .logo { display: block; margin: 0 auto 2px; max-height: 32px; }
      .struk-header { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 2px; }
      .struk-alamat { text-align: center; font-size: 10px; margin-bottom: 4px; white-space: pre-line; }
      .subheader { text-align: center; font-size: 9px; margin-bottom: 4px; }
      td { font-size: 15px; padding: 2px 0; vertical-align: top; word-break: break-word; }
      .item-row { display: flex; flex-direction: column; margin-bottom: 2px; border-top: 1px dotted #999; padding-bottom: 2px; }
      .item-name { font-weight: 400; word-wrap: break-word; font-size: 15px; }
      .item-info { display: flex; justify-content: space-between; font-size: 15px; font-weight: 200; }
      .total-section { border-top: 1px dashed #000; margin-top: 6px; padding-top: 4px; font-weight: bold; font-size: 15px; }
      .thankyou { margin-top: 4px; text-align: center; font-style: italic; font-size: 10px; }
    </style>
  </head>
  <body onload="window.print(); window.close();">
    <div class="struk">
      <img class="logo" src="${logoBase64}" alt="logo" />
      <div class="struk-header">TOKO YANI</div>
      <div class="struk-alamat">${alamatToko}</div>
      <div class="subheader">Tanggal: ${tanggalStr}</div>
      ${printContents}
      <div class="thankyou">Terima kasih telah berbelanja</div>
    </div>
  </body>
</html>`);
    printWindow.document.close();
  };

  // ── Transaksi ───────────────────────────────────────────────────────────────
  const { handleSubmitTransaksi, handleSubmitTanpaCetakStruk } = useTransaksi({
    dataPembelian: s.dataPembelian,
    setDataPembelian: s.setDataPembelian,
    bayarNominal: s.bayarNominal,
    setBayar: s.setBayar,
    setBayarNominal: s.setBayarNominal,
    setDiskonValue: s.setDiskonValue,
    setNewItem: s.setNewItem,
    newItem: s.newItem,
    setTotalHutangPelanggan: s.setTotalHutangPelanggan,
    total: s.total,
    kembalian: s.kembalian,
    showAlert: s.showAlert,
    handlePrintStruk,
  });

  // ── History transaksi ───────────────────────────────────────────────────────
  useHistoryTransaksi({
    lihatHistoryTransaksiOpen: s.lihatHistoryTransaksiOpen,
    filterHistoryTransaksi: s.filterHistoryTransaksi,
    setDataHistoryTransaksi: s.setDataHistoryTransaksi,
    setLoadingHistoryTransaksi: s.setLoadingHistoryTransaksi,
    setLokasiList: s.setLokasiList,
    setHistoryTransaksiList: s.setHistoryTransaksiList,
    userRole: s.userRole,
    getUserLokasi: s.getUserLokasi,
  });

  // ── Fetch produk ────────────────────────────────────────────────────────────
  useEffect(() => {
    s.setProdukLoading(true);
    s.setProdukReady(false);
    api
      .get("/stok/", { headers: getAuthHeaders() })
      .then((res) => {
        s.setProdukList(res.data.data || []);
        s.setProdukReady(true);
      })
      .catch(() => {
        s.setProdukError("Gagal mengambil data produk");
        s.setProdukReady(false);
      })
      .finally(() => s.setProdukLoading(false));
  }, []);

  useEffect(() => {
    if (s.barangModalOpen) {
      s.setProdukLoading(true);
      s.setProdukError(null);
      const lokasiId =
        s.userRole === "admin" ? s.selectedLokasi : s.getUserLokasi();
      api
        .get("/stok/", {
          headers: getAuthHeaders(),
          params: lokasiId ? { id_lokasi: lokasiId } : {},
        })
        .then((res) => s.setProdukList(res.data.data))
        .catch(() => s.setProdukError("Gagal mengambil data produk"))
        .finally(() => s.setProdukLoading(false));
    }
  }, [s.barangModalOpen, s.selectedLokasi, s.userRole]);

  useEffect(() => {
    if (s.barangModalOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => s.setLokasiList(res.data || []))
        .catch(() => s.setLokasiList([]));
    }
  }, [s.barangModalOpen]);

  // ── Fetch pelanggan ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (s.kontakModalOpen) {
      s.setPelangganLoading(true);
      s.setPelangganError(null);
      api
        .get("/pelanggan/", { headers: getAuthHeaders() })
        .then((res) => s.setPelangganList(res.data.data || []))
        .catch(() => s.setPelangganError("Gagal mengambil data pelanggan"))
        .finally(() => s.setPelangganLoading(false));
    }
  }, [s.kontakModalOpen]);

  // ── Fetch hutang pelanggan ──────────────────────────────────────────────────
  useEffect(() => {
    if (!s.newItem.id_pelanggan) return;
    const fetch = async () => {
      try {
        const res = await api.get("/transaksi/", {
          headers: getAuthHeaders(),
          params: { id_pelanggan: s.newItem.id_pelanggan },
        });
        let latestHutang = 0;
        if (
          res.data &&
          res.data.length > 0 &&
          res.data[0].total_hutang !== undefined
        ) {
          latestHutang = res.data[0].total_hutang;
        }
        const tambahanHutang = s.kembalian < 0 ? Math.abs(s.kembalian) : 0;
        s.setTotalHutangPelanggan(latestHutang + tambahanHutang);
      } catch (err) {
        console.error("Gagal ambil total hutang:", err);
        s.setTotalHutangPelanggan(null);
      }
    };
    fetch();
  }, [s.newItem.id_pelanggan]);

  // ── Lokasi untuk admin ──────────────────────────────────────────────────────
  useEffect(() => {
    if (s.userRole === "admin") {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => s.setLokasiList(res.data || []));
    }
  }, [s.userRole]);

  // ── Detail transaksi ────────────────────────────────────────────────────────
  const openDetailTransaksi = async (id_transaksi) => {
    try {
      const res = await api.get(`/transaksi/${id_transaksi}`, {
        headers: getAuthHeaders(),
      });
      s.setDetailTransaksiData(res.data?.data?.[0] || null);
      s.setDetailTransaksiOpen(true);
    } catch {
      s.showAlert("error", "Gagal mengambil detail transaksi");
    }
  };
  const closeDetailTransaksi = () => {
    s.setDetailTransaksiOpen(false);
    s.setDetailTransaksiData(null);
  };

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    if (scanInputRef.current) scanInputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        scanInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        bayarInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        s.openKontakModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="">
      {s.alert.show && (
        <div
          className={`fixed top-4 left-1/2 z-[9999] -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-sm font-semibold ${
            s.alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ Width: 220, textAlign: "center" }}
        >
          {s.alert.message}
        </div>
      )}

      <h1 className="text-2xl font-bold pb-2">Kasir</h1>

      {/* Struk (hidden, untuk print) */}
      <div ref={strukRef} style={{ display: "none" }}>
        <div>
          {s.dataPembelian.map((item, idx) => (
            <div key={idx} className="item-row">
              <div className="item-name">
                {capitalizeWords(item.nama_produk)}
              </div>
              <div className="item-info">
                <span>
                  {item.qty} x Rp.
                  {Number(item.harga_jual).toLocaleString("id-ID")}
                </span>
                <span>
                  Rp.{(item.qty * item.harga_jual).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
          <div className="total-section">
            {s.diskon > 0 && (
              <>
                <div className="item-info">
                  <span>SubTotal :</span>
                  <span>Rp{s.subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="item-info">
                  <span>Diskon :</span>
                  <span>Rp.{s.diskon.toLocaleString("id-ID")}</span>
                </div>
              </>
            )}
            <div className="item-info">
              <span>Total :</span>
              <span>Rp.{s.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="item-info">
              <span>Bayar :</span>
              <span>
                {s.bayarNominal === 0
                  ? "-"
                  : `Rp.${s.bayarNominal.toLocaleString("id-ID")}`}
              </span>
            </div>
            <div
              className="item-info"
              style={{ color: s.kembalian < 0 ? "red" : "black" }}
            >
              <span>{s.kembalian < 0 ? "Hutang :" : "Kembali :"}</span>
              <span>{`Rp.${Math.abs(s.kembalian).toLocaleString(
                "id-ID"
              )}`}</span>
            </div>
            {s.newItem.nama_pelanggan && (
              <>
                <div className="item-info">
                  <span>Pelanggan :</span>
                  <span>{capitalizeWords(s.newItem.nama_pelanggan)}</span>
                </div>
                {s.totalHutangPelanggan !== null && (
                  <div className="item-info">
                    <span>Total Hutang :</span>
                    <span>
                      Rp.
                      {Number(s.totalHutangPelanggan).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg py-4 px-6 shadow-md">
        <div className="text-sm font-semibold">Pembelian</div>
        <div className="text-xs text-gray-500">
          Detail pembelian ditampilkan disini
        </div>

        <div className="flex items-center gap-2 mt-2 mb-4">
          <button
            className="bg-[#FF4778] p-2 rounded-[10px] text-xs text-white hover:bg-[#FF87A7]"
            onClick={() => s.setBarangModalOpen(true)}
          >
            Lihat Daftar Produk
          </button>
          <button
            className="bg-green-400 p-2 rounded-[10px] text-xs text-white hover:bg-green-600"
            onClick={s.openLihatHistoryTransaksi}
          >
            Lihat Daftar Transaksi
          </button>

          {/* Scan barcode */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <IoQrCodeOutline
                size={20}
                className={s.produkReady ? "text-[#FF4778]" : "text-gray-400"}
              />
            </span>
            <input
              ref={scanInputRef}
              type="text"
              disabled={!s.produkReady}
              placeholder={
                s.produkReady
                  ? "Scan / ketik barcode lalu Enter"
                  : "Memuat data stok..."
              }
              className={`border rounded-[10px] px-2 py-1.5 text-sm w-56 pl-8 transition-all duration-200 ${
                s.produkReady
                  ? "border-black bg-white hover:border-[#FF4778] focus:outline-none focus:ring-2 focus:ring-[#FF4778]"
                  : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onKeyDown={(e) => {
                if (!s.produkReady) return;
                if (e.key === "Enter" && e.target.value.trim()) {
                  if (!s.produkList || s.produkList.length === 0) {
                    s.showAlert("error", "Data stok belum siap");
                    e.target.value = "";
                    return;
                  }
                  const kode = e.target.value.trim();
                  const found = s.produkList.find(
                    (item) => String(item.barcode).trim() === kode
                  );
                  if (!found) {
                    s.showAlert("error", "Produk tidak ditemukan!");
                  } else if (Number(found.jumlah) <= 0) {
                    s.showAlert("error", "Stok produk kosong");
                  } else {
                    s.setDataPembelian((prev) => {
                      const idx = prev.findIndex(
                        (b) => b.id_produk === found.id_produk
                      );
                      if (idx !== -1) {
                        return prev.map((b, i) =>
                          i === idx ? { ...b, qty: Number(b.qty) + 1 } : b
                        );
                      }
                      return [
                        ...prev,
                        {
                          id_produk: found.id_produk,
                          nama_produk: found.nama_produk,
                          qty: 1,
                          satuan: found.satuan,
                          harga_jual: found.harga_jual,
                        },
                      ];
                    });
                  }
                  e.target.value = "";
                }
              }}
            />
            {!s.produkReady && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </span>
            )}
          </div>

          {/* Cari barang */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari barang..."
              className="border border-black rounded-[10px] px-2 py-1.5 text-sm w-56 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={s.searchProduk}
              onChange={(e) => s.setSearchProduk(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (s.searchProduk.trim() !== "") s.setBarangModalOpen(true);
                }
              }}
            />
          </div>
        </div>

        <TabelPembelian
          dataPembelian={s.dataPembelian}
          handlePembelianChange={s.handlePembelianChange}
          handleHapusPembelian={s.handleHapusPembelian}
        />

        <RingkasanPembayaran
          subtotal={s.subtotal}
          diskonValue={s.diskonValue}
          setDiskonValue={s.setDiskonValue}
          diskonType={s.diskonType}
          setDiskonType={s.setDiskonType}
          total={s.total}
          bayar={s.bayar}
          handleBayarChange={s.handleBayarChange}
          kembalian={s.kembalian}
          newItem={s.newItem}
          setNewItem={s.setNewItem}
          openKontakModal={s.openKontakModal}
          handleSubmitTransaksi={handleSubmitTransaksi}
          handleSubmitTanpaCetakStruk={handleSubmitTanpaCetakStruk}
          bayarInputRef={bayarInputRef}
        />

        <ModalKontak
          kontakModalOpen={s.kontakModalOpen}
          closeKontakModal={s.closeKontakModal}
          searchPelanggan={s.searchPelanggan}
          setSearchPelanggan={s.setSearchPelanggan}
          openTambahPelangganModal={s.openTambahPelangganModal}
          pelangganLoading={s.pelangganLoading}
          pelangganError={s.pelangganError}
          filteredPelangganList={s.filteredPelangganList}
          setNewItem={s.setNewItem}
          setKontakModalOpen={s.setKontakModalOpen}
          newItem={s.newItem}
        />

        <ModalTambahPelanggan
          tambahPelangganModalOpen={s.tambahPelangganModalOpen}
          setTambahPelangganModalOpen={s.setTambahPelangganModalOpen}
          tambahNamaPelanggan={s.tambahNamaPelanggan}
          setTambahNamaPelanggan={s.setTambahNamaPelanggan}
          tambahAlamatPelanggan={s.tambahAlamatPelanggan}
          setTambahAlamatPelanggan={s.setTambahAlamatPelanggan}
          tambahKontakPelanggan={s.tambahKontakPelanggan}
          setTambahKontakPelanggan={s.setTambahKontakPelanggan}
          kontakModalOpen={s.kontakModalOpen}
          setPelangganLoading={s.setPelangganLoading}
          setPelangganList={s.setPelangganList}
        />

        <ModalDaftarBarang
          barangModalOpen={s.barangModalOpen}
          setBarangModalOpen={s.setBarangModalOpen}
          userRole={s.userRole}
          selectedLokasi={s.selectedLokasi}
          setSelectedLokasi={s.setSelectedLokasi}
          lokasiList={s.lokasiList}
          searchProduk={s.searchProduk}
          handleSearchProdukChange={s.handleSearchProdukChange}
          produkLoading={s.produkLoading}
          produkError={s.produkError}
          filteredProdukList={s.filteredProdukList}
          setDataPembelian={s.setDataPembelian}
        />

        <ModalHistoryTransaksi
          lihatHistoryTransaksiOpen={s.lihatHistoryTransaksiOpen}
          closeLihatHistoryTransaksi={s.closeLihatHistoryTransaksi}
          userRole={s.userRole}
          lokasiList={s.lokasiList}
          filterHistoryTransaksi={s.filterHistoryTransaksi}
          setFilterHistoryTransaksi={s.setFilterHistoryTransaksi}
          handleFilterRiwayatTransaksiChange={
            s.handleFilterRiwayatTransaksiChange
          }
          historyTransaksiList={s.historyTransaksiList}
          loadingHistoryTransaksi={s.loadingHistoryTransaksi}
          dataHistoryTransaksi={s.dataHistoryTransaksi}
          openDetailTransaksi={openDetailTransaksi}
        />

        <ModalDetailTransaksi
          detailTransaksiOpen={s.detailTransaksiOpen}
          detailTransaksiData={s.detailTransaksiData}
          closeDetailTransaksi={closeDetailTransaksi}
        />
      </div>
    </div>
  );
};

export default Kasir;
