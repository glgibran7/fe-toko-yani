export const getTodayRange = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const tanggal = `${yyyy}-${mm}-${dd}`;
  return { tanggal_awal: tanggal, tanggal_akhir: tanggal };
};

export const getMonthRange = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const firstDay = `${yyyy}-${mm}-01`;
  const lastDay = `${yyyy}-${mm}-${String(
    new Date(yyyy, today.getMonth() + 1, 0).getDate()
  ).padStart(2, "0")}`;
  return { tanggal_awal: firstDay, tanggal_akhir: lastDay };
};

export const getYearRange = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const firstDay = `${yyyy}-01-01`;
  const lastDay = `${yyyy}-12-31`;
  return { tanggal_awal: firstDay, tanggal_akhir: lastDay };
};
