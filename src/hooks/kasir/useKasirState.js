import { useState, useEffect } from "react";
import { getLS, setLS, getAuthHeaders } from "../../utils/kasirHelpers";
import api from "../../utils/api";

export const useKasirState = () => {
  const getUserRole = () => localStorage.getItem("role");
  const getUserLokasi = () => localStorage.getItem("id_lokasi");

  const userRole = getUserRole();

  const [selectedLokasi, setSelectedLokasi] = useState(getUserLokasi());
  const [lokasiList, setLokasiList] = useState([]);

  const [dataPembelian, setDataPembelian] = useState(() =>
    getLS("kasir_dataPembelian", [])
  );
  useEffect(() => {
    setLS("kasir_dataPembelian", dataPembelian);
  }, [dataPembelian]);

  const [sortBy, setSortBy] = useState("nama_produk");
  const [sortAsc, setSortAsc] = useState(true);
  const [data, setData] = useState([]);

  const [barangModalOpen, setBarangModalOpen] = useState(false);
  const [diskonType, setDiskonType] = useState("nominal");
  const [diskonValue, setDiskonValue] = useState("");

  const [produkList, setProdukList] = useState([]);
  const [produkLoading, setProdukLoading] = useState(false);
  const [produkError, setProdukError] = useState(null);
  const [produkReady, setProdukReady] = useState(false);

  const [pelangganList, setPelangganList] = useState([]);
  const [pelangganLoading, setPelangganLoading] = useState(false);
  const [pelangganError, setPelangganError] = useState(null);

  const [kontakModalOpen, setKontakModalOpen] = useState(false);
  const [searchPelanggan, setSearchPelanggan] = useState("");
  const [tambahPelangganModalOpen, setTambahPelangganModalOpen] =
    useState(false);
  const [tambahNamaPelanggan, setTambahNamaPelanggan] = useState("");
  const [tambahAlamatPelanggan, setTambahAlamatPelanggan] = useState("");
  const [tambahKontakPelanggan, setTambahKontakPelanggan] = useState("");

  const [bayar, setBayar] = useState("");
  const [bayarNominal, setBayarNominal] = useState(0);

  const [newItem, setNewItem] = useState({ nama_pelanggan: "" });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [searchProduk, setSearchProduk] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("");

  const [lihatHistoryTransaksiOpen, setLihatHistoryTransaksi] = useState(false);
  const [filterHistoryTransaksi, setFilterHistoryTransaksi] = useState({
    tanggal_awal: "",
    tanggal_akhir: "",
    status_hutang: "",
    id_pelanggan: "",
    id_lokasi: userRole === "kasir" ? getUserLokasi() : "",
  });
  const [dataHistoryTransaksi, setDataHistoryTransaksi] = useState([]);
  const [loadingHistoryTransaksi, setLoadingHistoryTransaksi] = useState(false);
  const [historyTransaksiList, setHistoryTransaksiList] = useState([]);

  const [detailTransaksiOpen, setDetailTransaksiOpen] = useState(false);
  const [detailTransaksiData, setDetailTransaksiData] = useState(null);

  const [totalHutangPelanggan, setTotalHutangPelanggan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed
  const subtotal = dataPembelian.reduce(
    (sum, item) => sum + Number(item.harga_jual) * Number(item.qty),
    0
  );
  let diskon = 0;
  if (diskonType === "persen" && diskonValue) {
    diskon = (subtotal * Number(diskonValue)) / 100;
  } else if (diskonType === "nominal" && diskonValue) {
    diskon = Number(diskonValue);
  }
  const total = subtotal - diskon;
  const kembalian = bayarNominal - total;

  const sortedData = [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  const filteredPelangganList = pelangganList.filter((item) =>
    item.nama_pelanggan
      ?.toLowerCase()
      .includes(searchPelanggan.trim().toLowerCase())
  );

  const filteredProdukList = produkList.filter((item) => {
    const cocokCari =
      item.nama_produk?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.satuan?.toLowerCase().includes(searchProduk.toLowerCase());
    const cocokLokasi = filterLokasi ? item.id_lokasi == filterLokasi : true;
    const stokTersedia = Number(item.jumlah) > 0;
    return cocokCari && cocokLokasi && stokTersedia;
  });

  // Handlers
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 2000);
  };

  const handleBayarChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setBayar(raw ? "Rp." + Number(raw).toLocaleString("id-ID") : "");
    setBayarNominal(raw ? Number(raw) : 0);
  };

  const handlePembelianChange = (idx, field, value) => {
    setDataPembelian((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleHapusPembelian = (idx) => {
    setDataPembelian((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchProdukChange = (e) => setSearchProduk(e.target.value);

  const handleFilterRiwayatTransaksiChange = (e) => {
    const { name, value } = e.target;
    setFilterHistoryTransaksi((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortAsc(!sortAsc);
    else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const openKontakModal = () => setKontakModalOpen(true);
  const closeKontakModal = () => setKontakModalOpen(false);
  const openTambahPelangganModal = () => setTambahPelangganModalOpen(true);
  const openLihatHistoryTransaksi = () => setLihatHistoryTransaksi(true);
  const closeLihatHistoryTransaksi = () => setLihatHistoryTransaksi(false);

  return {
    // role & lokasi
    userRole,
    getUserLokasi,
    selectedLokasi,
    setSelectedLokasi,
    lokasiList,
    setLokasiList,
    filterLokasi,
    setFilterLokasi,

    // pembelian
    dataPembelian,
    setDataPembelian,
    handlePembelianChange,
    handleHapusPembelian,

    // sort
    sortBy,
    sortAsc,
    sortedData,
    handleSort,
    data,
    setData,

    // modal barang
    barangModalOpen,
    setBarangModalOpen,
    produkList,
    setProdukList,
    produkLoading,
    setProdukLoading,
    produkError,
    setProdukError,
    produkReady,
    setProdukReady,
    searchProduk,
    setSearchProduk,
    filteredProdukList,
    handleSearchProdukChange,

    // diskon & total
    diskonType,
    setDiskonType,
    diskonValue,
    setDiskonValue,
    subtotal,
    diskon,
    total,

    // bayar
    bayar,
    setBayar,
    bayarNominal,
    setBayarNominal,
    kembalian,
    handleBayarChange,

    // pelanggan
    pelangganList,
    setPelangganList,
    pelangganLoading,
    setPelangganLoading,
    pelangganError,
    setPelangganError,
    kontakModalOpen,
    setKontakModalOpen,
    searchPelanggan,
    setSearchPelanggan,
    filteredPelangganList,
    tambahPelangganModalOpen,
    setTambahPelangganModalOpen,
    tambahNamaPelanggan,
    setTambahNamaPelanggan,
    tambahAlamatPelanggan,
    setTambahAlamatPelanggan,
    tambahKontakPelanggan,
    setTambahKontakPelanggan,
    openTambahPelangganModal,
    openKontakModal,
    closeKontakModal,

    // form pelanggan
    newItem,
    setNewItem,
    handleAddChange,

    // alert
    alert,
    showAlert,

    // history transaksi
    lihatHistoryTransaksiOpen,
    openLihatHistoryTransaksi,
    closeLihatHistoryTransaksi,
    filterHistoryTransaksi,
    setFilterHistoryTransaksi,
    dataHistoryTransaksi,
    setDataHistoryTransaksi,
    loadingHistoryTransaksi,
    setLoadingHistoryTransaksi,
    historyTransaksiList,
    setHistoryTransaksiList,
    handleFilterRiwayatTransaksiChange,

    // detail transaksi
    detailTransaksiOpen,
    setDetailTransaksiOpen,
    detailTransaksiData,
    setDetailTransaksiData,

    // hutang & submit
    totalHutangPelanggan,
    setTotalHutangPelanggan,
    isSubmitting,
    setIsSubmitting,
  };
};
