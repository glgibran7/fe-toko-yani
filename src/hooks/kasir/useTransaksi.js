import api from "../../utils/api";
import { getAuthHeaders } from "../../utils/kasirHelpers";

export const useTransaksi = ({
  dataPembelian,
  setDataPembelian,
  bayarNominal,
  setBayar,
  setBayarNominal,
  setDiskonValue,
  setNewItem,
  newItem,
  total,
  kembalian,
  showAlert,
  handlePrintStruk,
}) => {
  const buildPayload = () => {
    const id_kasir = Number(localStorage.getItem("id_kasir"));
    const id_lokasi = Number(localStorage.getItem("id_lokasi"));
    return {
      id_kasir,
      id_lokasi,
      id_pelanggan: Number(newItem.id_pelanggan) || null,
      nama_pelanggan: newItem.nama_pelanggan || "",
      kontak: newItem.kontak || "",
      total: Math.round(total),
      tunai: Math.round(bayarNominal),
      kembalian: Math.max(0, Math.round(kembalian)),
      items: dataPembelian.map((item) => ({
        id_produk: Number(item.id_produk),
        qty: Number(item.qty),
        harga_jual: Number(item.harga_jual),
      })),
    };
  };

  const resetForm = () => {
    setDataPembelian([]);
    setBayar("");
    setBayarNominal(0);
    setDiskonValue("");
    setNewItem({ nama_pelanggan: "" });
  };

  const validate = () => {
    if (dataPembelian.length === 0) {
      showAlert("error", "Tidak ada produk yang dibeli.");
      return false;
    }
    if (bayarNominal <= 0 || kembalian < 0) {
      if (!newItem.nama_pelanggan || newItem.nama_pelanggan.trim() === "") {
        showAlert("error", "Jika hutang pelanggan wajib diisi.");
        return false;
      }
    }
    return true;
  };

  const handleSubmitTransaksi = async () => {
    if (!validate()) return;
    try {
      const payload = buildPayload();
      if (payload.items.some((i) => !i.id_produk && i.id_produk !== 0)) {
        showAlert("error", "Ada produk dengan ID tidak valid.");
        return;
      }
      await api.post("/transaksi/", payload, { headers: getAuthHeaders() });
      showAlert("success", "Transaksi berhasil disimpan!");
      handlePrintStruk();
      showAlert("success", "Struk berhasil dicetak!");
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        "Gagal menyimpan transaksi:\n" +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  const handleSubmitTanpaCetakStruk = async () => {
    if (!validate()) return;
    try {
      const payload = buildPayload();
      if (payload.items.some((i) => !i.id_produk && i.id_produk !== 0)) {
        showAlert("error", "Ada produk dengan ID tidak valid.");
        return;
      }
      await api.post("/transaksi/", payload, { headers: getAuthHeaders() });
      showAlert("success", "Transaksi berhasil disimpan!");
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        "Gagal menyimpan transaksi:\n" +
          (err.response?.data?.detail || err.message)
      );
    }
    const payload = buildPayload();
    console.log("payload:", JSON.stringify(payload, null, 2));
  };

  return { handleSubmitTransaksi, handleSubmitTanpaCetakStruk };
};
