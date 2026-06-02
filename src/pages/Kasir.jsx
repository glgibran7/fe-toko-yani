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

  // ─────────────────────────────────────────────────────────────
  // PRINT STRUK
  // ─────────────────────────────────────────────────────────────
  const handlePrintStruk = (totalHutangFinal = s.totalHutangPelanggan) => {
    const tanggalStr = new Date().toLocaleString("id-ID");
    const alamatToko = "Dusun Muhajirin, Desa Nusa Jaya";

    const itemRows = s.dataPembelian
      .map(
        (item) => `
      <div class="item-row">
        <div class="item-name">
          ${capitalizeWords(item.nama_produk)}
        </div>

        <div class="item-info">
          <span>
            ${item.qty} x Rp.${Number(item.harga_jual).toLocaleString("id-ID")}
          </span>

          <span>
            Rp.${(item.qty * item.harga_jual).toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    `
      )
      .join("");

    const diskonSection =
      s.diskon > 0
        ? `
      <div class="item-info">
        <span>SubTotal :</span>
        <span>Rp.${s.subtotal.toLocaleString("id-ID")}</span>
      </div>

      <div class="item-info">
        <span>Diskon :</span>
        <span>Rp.${s.diskon.toLocaleString("id-ID")}</span>
      </div>
    `
        : "";

    const hutangSection = s.newItem.nama_pelanggan
      ? `
      <div class="item-info">
        <span>Pelanggan :</span>
        <span>
          ${capitalizeWords(s.newItem.nama_pelanggan)}
        </span>
      </div>

      ${
        totalHutangFinal !== null
          ? `
        <div class="item-info">
          <span>Total Hutang :</span>
          <span>
            Rp.${Number(totalHutangFinal).toLocaleString("id-ID")}
          </span>
        </div>
      `
          : ""
      }
    `
      : "";

    const printContents = `
      ${itemRows}

      <div class="total-section">
        ${diskonSection}

        <div class="item-info">
          <span>Total :</span>
          <span>
            Rp.${s.total.toLocaleString("id-ID")}
          </span>
        </div>

        <div class="item-info">
          <span>Bayar :</span>

          <span>
            ${
              s.bayarNominal === 0
                ? "-"
                : `Rp.${s.bayarNominal.toLocaleString("id-ID")}`
            }
          </span>
        </div>

        <div
          class="item-info"
          style="color:${s.kembalian < 0 ? "red" : "black"}"
        >
          <span>
            ${s.kembalian < 0 ? "Hutang :" : "Kembali :"}
          </span>

          <span>
            Rp.${Math.abs(s.kembalian).toLocaleString("id-ID")}
          </span>
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
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }

            body {
              font-family: monospace, Poppins, sans-serif;
              font-size: 18px;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
            }

            .struk {
              width: 58mm;
              max-width: 58mm;
              margin: 0 auto;
              padding: 2px;
              box-sizing: border-box;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }

            .logo {
              display: block;
              margin: 0 auto 2px;
              max-height: 32px;
            }

            .struk-header {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 2px;
            }

            .struk-alamat {
              text-align: center;
              font-size: 10px;
              margin-bottom: 4px;
              white-space: pre-line;
            }

            .subheader {
              text-align: center;
              font-size: 9px;
              margin-bottom: 4px;
            }

            td {
              font-size: 15px;
              padding: 2px 0;
              vertical-align: top;
              word-break: break-word;
            }

            .item-row {
              display: flex;
              flex-direction: column;
              margin-bottom: 2px;
              border-top: 1px dotted #999;
              padding-bottom: 2px;
            }

            .item-name {
              font-weight: 400;
              word-wrap: break-word;
              font-size: 15px;
            }

            .item-info {
              display: flex;
              justify-content: space-between;
              font-size: 15px;
              font-weight: 200;
            }

            .total-section {
              border-top: 1px dashed #000;
              margin-top: 6px;
              padding-top: 4px;
              font-weight: bold;
              font-size: 15px;
            }

            .thankyou {
              margin-top: 4px;
              text-align: center;
              font-style: italic;
              font-size: 10px;
            }
          </style>
        </head>

        <body onload="window.print(); window.close();">
          <div class="struk">
            <img
              class="logo"
              src="${logoBase64}"
              alt="logo"
            />

            <div class="struk-header">
              TOKO YANI
            </div>

            <div class="struk-alamat">
              ${alamatToko}
            </div>

            <div class="subheader">
              Tanggal: ${tanggalStr}
            </div>

            ${printContents}

            <div class="thankyou">
              Terima kasih telah berbelanja
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // ─────────────────────────────────────────────────────────────
  // TRANSAKSI
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // HISTORY TRANSAKSI
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // FETCH PRODUK
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    s.setProdukLoading(true);
    s.setProdukReady(false);

    api
      .get("/stok/", {
        headers: getAuthHeaders(),
      })
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

  // ─────────────────────────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
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

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* ALERT */}
      {s.alert.show && (
        <div
          className={`
            fixed
            top-5
            left-1/2
            -translate-x-1/2
            z-[9999]
            px-5
            py-3
            rounded-2xl
            shadow-2xl
            text-white
            text-sm
            font-medium
            transition-all
            duration-300
            ${s.alert.type === "success" ? "bg-emerald-500" : "bg-red-500"}
          `}
        >
          {s.alert.message}
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Kasir</h1>

        <p className="text-sm text-gray-500 mt-1">
          Kelola transaksi dan pembayaran pelanggan
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div
        className="
          bg-white
          rounded-3xl
          p-5
          lg:p-6
          shadow-sm
          border
          border-gray-200
        "
      >
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Pembelian</h2>

            <p className="text-sm text-gray-500 mt-1">
              Detail produk yang dibeli pelanggan
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+B</kbd>
              Scan
            </div>

            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+F</kbd>
              Cari
            </div>

            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Y</kbd>
              Bayar
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div
          className="
            flex
            flex-col
            xl:flex-row
            xl:items-center
            gap-3
            mt-6
            mb-6
          "
        >
          {/* BUTTON PRODUK */}
          <button
            className="
              bg-black
              hover:bg-gray-900
              text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-200
              shadow-sm
            "
            onClick={() => s.setBarangModalOpen(true)}
          >
            Lihat Daftar Produk
          </button>

          {/* BUTTON HISTORY */}
          <button
            className="
              bg-emerald-500
              hover:bg-emerald-600
              text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-200
              shadow-sm
            "
            onClick={s.openLihatHistoryTransaksi}
          >
            Lihat Daftar Transaksi
          </button>

          {/* SCAN BARCODE */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoQrCodeOutline
                size={20}
                className={s.produkReady ? "text-black" : "text-gray-400"}
              />
            </span>

            <input
              ref={scanInputRef}
              type="text"
              disabled={!s.produkReady}
              placeholder={
                s.produkReady
                  ? "Scan barcode lalu Enter"
                  : "Memuat data stok..."
              }
              className={`
                h-11
                rounded-2xl
                border
                px-4
                pl-10
                text-sm
                w-full
                xl:w-72
                transition-all
                duration-200
                shadow-sm
                ${
                  s.produkReady
                    ? `
                      border-gray-300
                      bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-black
                      focus:border-black
                    `
                    : `
                      border-gray-200
                      bg-gray-100
                      text-gray-400
                      cursor-not-allowed
                    `
                }
              `}
            />
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari barang..."
              className="
                h-11
                rounded-2xl
                border
                border-gray-300
                px-4
                text-sm
                w-full
                xl:w-72
                transition-all
                duration-200
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
              "
              value={s.searchProduk}
              onChange={(e) => s.setSearchProduk(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* TABLE */}
          <div className="2xl:col-span-2">
            <TabelPembelian
              dataPembelian={s.dataPembelian}
              handlePembelianChange={s.handlePembelianChange}
              handleHapusPembelian={s.handleHapusPembelian}
            />
          </div>

          {/* PAYMENT */}
          <div>
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
          </div>
        </div>

        {/* MODALS */}
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
        />

        <ModalDetailTransaksi
          detailTransaksiOpen={s.detailTransaksiOpen}
          detailTransaksiData={s.detailTransaksiData}
          closeDetailTransaksi={() => {
            s.setDetailTransaksiOpen(false);
            s.setDetailTransaksiData(null);
          }}
        />
      </div>
    </div>
  );
};

export default Kasir;
