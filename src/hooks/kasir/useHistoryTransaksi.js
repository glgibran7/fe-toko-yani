import { useEffect } from "react";
import api from "../../utils/api";
import { getAuthHeaders } from "../../utils/kasirHelpers";

export const useHistoryTransaksi = ({
  lihatHistoryTransaksiOpen,
  filterHistoryTransaksi,
  setDataHistoryTransaksi,
  setLoadingHistoryTransaksi,
  setLokasiList,
  setHistoryTransaksiList,
  userRole,
  getUserLokasi,
}) => {
  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []));
    }
  }, [lihatHistoryTransaksiOpen]);

  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      api
        .get("/pelanggan/", {
          headers: getAuthHeaders(),
        })
        .then((res) =>
          setHistoryTransaksiList(
            Array.isArray(res.data.data) ? res.data.data : []
          )
        )
        .catch(() => setHistoryTransaksiList([]));
    }
  }, [lihatHistoryTransaksiOpen]);

  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      setLoadingHistoryTransaksi(true);
      api
        .get("/transaksi/", {
          headers: getAuthHeaders(),
          params: {
            tanggal_awal: filterHistoryTransaksi.tanggal_awal,
            tanggal_akhir: filterHistoryTransaksi.tanggal_akhir,
            id_pelanggan: filterHistoryTransaksi.id_pelanggan,
            ...(userRole === "kasir"
              ? { id_lokasi: getUserLokasi() }
              : filterHistoryTransaksi.id_lokasi
              ? { id_lokasi: filterHistoryTransaksi.id_lokasi }
              : {}),
          },
        })
        .then((res) => {
          const sorted = (res.data || []).sort(
            (a, b) => b.id_transaksi - a.id_transaksi
          );
          setDataHistoryTransaksi(sorted);
        })
        .catch(() => setDataHistoryTransaksi([]))
        .finally(() => setLoadingHistoryTransaksi(false));
    }
  }, [
    lihatHistoryTransaksiOpen,
    filterHistoryTransaksi.tanggal_awal,
    filterHistoryTransaksi.tanggal_akhir,
    filterHistoryTransaksi.id_pelanggan,
    filterHistoryTransaksi.id_lokasi,
  ]);
};
