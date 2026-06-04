import React, { useEffect, useState, useRef } from "react";
import {
  History,
  Gift,
  RefreshCcw,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  Star,
  X,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Coins,
  TrendingUp,
} from "lucide-react";
import api from "../utils/api";

// ─── STYLES ──────────────────────────────────
const _style = document.createElement("style");
_style.textContent = `
  :root {
    --rose:        #E8365D;
    --rose-light:  #FF6B8A;
    --rose-pale:   #FFF1F4;
    --rose-border: #FDDDE4;
    --gold:        #C9963A;
    --gold-pale:   #FFFBF0;
    --ink:         #1A1118;
    --ink-soft:    #4A3D45;
    --ink-muted:   #8A7A82;
    --surface:     #FDFBFC;
    --surface-2:   #F7F3F5;
    --border:      #EDE6E9;
    --white:       #FFFFFF;
    --green:       #1E8A5E;
    --green-pale:  #EDFAF4;
    --red-pale:    #FFF0F0;
  }
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.96); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    from { background-position: -600px 0; }
    to   { background-position:  600px 0; }
  }

  .lp-fade     { animation: fadeUp 0.22s ease both; }
  .lp-toast    { animation: toastIn 0.28s ease both; }
  .lp-modal    { animation: modalIn 0.26s cubic-bezier(0.34,1.5,0.64,1) both; }

  .lp-row      { transition: background 0.13s; }
  .lp-row:hover{ background: var(--rose-pale) !important; }

  .lp-btn:active      { transform: scale(0.97); }
  .lp-icon-btn:active { transform: scale(0.90); }

  .lp-scroll::-webkit-scrollbar       { width: 4px; height: 4px; }
  .lp-scroll::-webkit-scrollbar-track { background: transparent; }
  .lp-scroll::-webkit-scrollbar-thumb { background: var(--rose-border); border-radius: 99px; }

  .lp-tabs-bar::-webkit-scrollbar { display: none; }
  .lp-tabs-bar { -ms-overflow-style: none; scrollbar-width: none; }

  .skeleton {
    background: linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }

  .lp-opt { display: block; width: 100%; text-align: left; padding: 9px 14px;
            font-size: 13px; border: none; background: transparent; cursor: pointer;
            transition: background 0.12s, color 0.12s; color: var(--ink); }
  .lp-opt:hover, .lp-opt.sel { background: var(--rose-pale); color: var(--rose); }

  .lp-tab { display: flex; align-items: center; gap: 7px; padding: 9px 18px;
            border: none; cursor: pointer; font-size: 13px; font-weight: 500;
            border-bottom: 2px solid transparent; margin-bottom: -2px;
            background: transparent; color: var(--ink-muted);
            transition: color 0.15s, background 0.15s, border-color 0.15s;
            border-radius: 10px 10px 0 0; white-space: nowrap; }
  .lp-tab:hover  { color: var(--rose); background: var(--rose-pale); }
  .lp-tab.active { color: var(--rose); background: var(--rose-pale);
                   border-bottom-color: var(--rose); font-weight: 700; }

  .lp-input {
    width: 100%; padding: 10px 12px; font-size: 13px; color: var(--ink);
    border: 1.5px solid var(--border); border-radius: 11px;
    background: var(--white); outline: none; transition: border-color 0.18s, box-shadow 0.18s;
  }
  .lp-input:focus {
    border-color: var(--rose);
    box-shadow: 0 0 0 3px rgba(232,54,93,0.09);
  }
  .lp-input.has-prefix { padding-left: 36px; }
  .lp-input.has-icon   { padding-left: 34px; padding-right: 32px; }

  .lp-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 20px; border: none; border-radius: 11px; cursor: pointer;
    font-size: 13px; font-weight: 600; transition: box-shadow 0.18s, opacity 0.18s;
    background: linear-gradient(135deg, var(--rose) 0%, #C4284E 100%);
    color: #fff; box-shadow: 0 4px 14px rgba(232,54,93,0.28);
  }
  .lp-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .lp-primary:not(:disabled):hover { box-shadow: 0 6px 20px rgba(232,54,93,0.40); }
  .lp-primary.full { width: 100%; }
`;
document.head.appendChild(_style);

// ─── TOAST ───────────────────────────────────
const useAlert = () => {
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const t = useRef(null);
  const showAlert = (type, message) => {
    if (t.current) clearTimeout(t.current);
    setAlert({ show: true, type, message });
    t.current = setTimeout(
      () => setAlert({ show: false, type: "", message: "" }),
      2800
    );
  };
  return { alert, showAlert };
};

const Toast = ({ alert }) => {
  if (!alert.show) return null;
  const ok = alert.type === "success";
  return (
    <div
      className="lp-toast"
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: ok ? "#0D3D25" : "#4D0F1E",
        color: "#fff",
        padding: "11px 18px",
        borderRadius: 13,
        boxShadow: "0 8px 30px rgba(0,0,0,0.20)",
        fontSize: 13,
        fontWeight: 500,
        minWidth: 220,
      }}
    >
      {ok ? (
        <CheckCircle2 size={15} style={{ color: "#52E3A0", flexShrink: 0 }} />
      ) : (
        <AlertCircle size={15} style={{ color: "#FF8FA0", flexShrink: 0 }} />
      )}
      {alert.message}
    </div>
  );
};

// ─── FIELD LABEL ─────────────────────────────
const FL = ({ children }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: "var(--ink-muted)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      marginBottom: 5,
    }}
  >
    {children}
  </div>
);

// ─── POIN CHIP ───────────────────────────────
const PoinChip = ({ nama, poin }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: "linear-gradient(135deg,var(--rose-pale),var(--gold-pale))",
      border: "1.5px solid var(--rose-border)",
      borderRadius: 13,
      padding: "9px 15px",
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,var(--rose),var(--rose-light))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Coins size={14} color="white" />
    </div>
    <div>
      <div style={{ fontSize: 11, color: "var(--ink-muted)", fontWeight: 500 }}>
        {nama}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "var(--rose)",
          lineHeight: 1.2,
        }}
      >
        {poin?.toLocaleString("id-ID")} Poin
      </div>
    </div>
  </div>
);

// ─── COMBOBOX ────────────────────────────────
const Combo = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Pilih...",
  displayKey = "label",
  valueKey = "value",
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const sel = options.find((o) => String(o[valueKey]) === String(value));
  useEffect(() => {
    setQuery(sel ? sel[displayKey] : "");
  }, [value]);

  const filtered = options.filter((o) =>
    Object.values(o)
      .join(" ")
      .toLowerCase()
      .includes((query || "").toLowerCase())
  );
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Search
        size={13}
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ink-muted)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <ChevronDown
        size={13}
        style={{
          position: "absolute",
          right: 11,
          top: "50%",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          color: "var(--ink-muted)",
          pointerEvents: "none",
          transition: "transform 0.2s",
          zIndex: 1,
        }}
      />
      <input
        className={`lp-input has-icon${open ? " " : ""}`}
        style={{
          borderColor: open ? "var(--rose)" : undefined,
          boxShadow: open ? "0 0 0 3px rgba(232,54,93,0.09)" : undefined,
        }}
        type="text"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
      />
      {open && (
        <div
          className="lp-scroll"
          style={{
            position: "absolute",
            zIndex: 50,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--white)",
            border: "1.5px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 10px 36px rgba(26,17,24,0.10)",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "11px 14px",
                fontSize: 12,
                color: "var(--ink-muted)",
                textAlign: "center",
              }}
            >
              Tidak ditemukan.
            </div>
          ) : (
            filtered.map((o) => (
              <button
                key={o[valueKey]}
                className={`lp-opt${
                  String(o[valueKey]) === String(value) ? " sel" : ""
                }`}
                onClick={() => {
                  onChange(o[valueKey]);
                  setQuery(o.nama_pelanggan);
                  setOpen(false);
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {o.nama_pelanggan || o.label || o.nama_produk}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {o.kontak || ""}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── PRODUCT SEARCH ──────────────────────────
const ProdukSearch = ({ value, onChange }) => {
  const [query, setQuery] = useState(value?.nama_produk || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    setQuery(value?.nama_produk || "");
  }, [value?.nama_produk]);

  const search = async (q) => {
    setQuery(q);
    onChange({ id_produk: "", nama_produk: q });
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const r = await api.get(`/produk/?search=${encodeURIComponent(q)}`);
      setResults(r.data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Search
        size={13}
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ink-muted)",
          pointerEvents: "none",
        }}
      />
      <input
        className="lp-input has-icon"
        style={{
          borderColor: open ? "var(--rose)" : undefined,
          boxShadow: open ? "0 0 0 3px rgba(232,54,93,0.09)" : undefined,
          paddingRight: 12,
        }}
        type="text"
        value={query}
        placeholder="Ketik nama produk..."
        autoComplete="off"
        onChange={(e) => search(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
      />
      {loading && (
        <span
          style={{
            position: "absolute",
            right: 11,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 11,
            color: "var(--ink-muted)",
          }}
        >
          ...
        </span>
      )}
      {open && (
        <div
          className="lp-scroll"
          style={{
            position: "absolute",
            zIndex: 50,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--white)",
            border: "1.5px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 10px 36px rgba(26,17,24,0.10)",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: "11px 14px",
                fontSize: 12,
                color: "var(--ink-muted)",
                textAlign: "center",
              }}
            >
              Tidak ditemukan.
            </div>
          ) : (
            results.map((p) => (
              <button
                key={p.id_produk}
                className="lp-opt"
                onClick={() => {
                  onChange({
                    id_produk: p.id_produk,
                    nama_produk: p.nama_produk,
                  });
                  setQuery(p.nama_produk);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{p.nama_produk}</span>
                <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                  #{p.id_produk}
                </span>
              </button>
            ))
          )}
        </div>
      )}
      {value?.id_produk && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 5,
            fontSize: 11,
          }}
        >
          <CheckCircle2 size={12} style={{ color: "var(--green)" }} />
          <span style={{ color: "var(--green)", fontWeight: 600 }}>
            {value.nama_produk}
          </span>
          <span style={{ color: "var(--ink-muted)" }}>
            · ID {value.id_produk}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── MODAL ───────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      background: "rgba(26,17,24,0.42)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
  >
    <div
      className="lp-modal"
      style={{
        background: "var(--white)",
        borderRadius: 18,
        padding: "26px 26px 22px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 24px 70px rgba(26,17,24,0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "var(--rose-pale)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--surface-2)")
          }
        >
          <X size={14} color="var(--ink-soft)" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── MODAL FOOTER ────────────────────────────
const MFooter = ({ onCancel, submitting, label = "Simpan" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      paddingTop: 6,
    }}
  >
    <button
      type="button"
      onClick={onCancel}
      style={{
        padding: "9px 18px",
        borderRadius: 10,
        border: "1.5px solid var(--border)",
        background: "transparent",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        color: "var(--ink-soft)",
        transition: "background 0.15s",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.background = "var(--surface-2)")
      }
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
    >
      Batal
    </button>
    <button type="submit" className="lp-btn lp-primary" disabled={submitting}>
      <Save size={13} /> {submitting ? "Menyimpan..." : label}
    </button>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────
const Empty = ({ colSpan, icon: Icon, msg }) => (
  <tr>
    <td colSpan={colSpan} style={{ textAlign: "center", padding: "44px 20px" }}>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon && <Icon size={20} color="var(--border)" />}
        </div>
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{msg}</span>
      </div>
    </td>
  </tr>
);

// ─── SKELETON ROWS ───────────────────────────
const Skeletons = ({ cols, rows = 4 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {cols.map((w, j) => (
        <td key={j} style={{ padding: "13px 14px" }}>
          <div className="skeleton" style={{ height: 11, width: w }} />
        </td>
      ))}
    </tr>
  ));

// ─── TABLE STYLES ────────────────────────────
const TH = ({ children, center }) => (
  <th
    style={{
      padding: "10px 14px",
      background: "var(--surface-2)",
      fontSize: 10,
      fontWeight: 700,
      color: "var(--ink-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: center ? "center" : "left",
      borderBottom: "1.5px solid var(--border)",
      position: "sticky",
      top: 0,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </th>
);

const TD = ({ children, center, bold, muted, style: s }) => (
  <td
    style={{
      padding: "11px 14px",
      borderBottom: "1px solid var(--border)",
      textAlign: center ? "center" : "left",
      fontWeight: bold ? 600 : 400,
      color: muted ? "var(--ink-muted)" : "var(--ink)",
      fontSize: 13,
      whiteSpace: "nowrap",
      ...s,
    }}
  >
    {children}
  </td>
);

// ─── BADGE ───────────────────────────────────
const Badge = ({ children, color = "rose" }) => {
  const map = {
    rose: {
      bg: "linear-gradient(135deg,var(--rose-pale),var(--gold-pale))",
      border: "var(--rose-border)",
      text: "var(--rose)",
    },
    green: { bg: "var(--green-pale)", border: "#A7F3D0", text: "var(--green)" },
    red: { bg: "var(--red-pale)", border: "#FECDD3", text: "#C0293E" },
  };
  const c = map[color] || map.rose;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontWeight: 700,
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 99,
      }}
    >
      {children}
    </span>
  );
};

// ─── ICON BUTTON ─────────────────────────────
const IconBtn = ({ onClick, icon: Icon, color = "rose" }) => {
  const map = {
    rose: {
      idle: "var(--rose-pale)",
      idleC: "var(--rose)",
      hover: "var(--rose)",
      hoverC: "#fff",
    },
    red: {
      idle: "var(--red-pale)",
      idleC: "#C0293E",
      hover: "#C0293E",
      hoverC: "#fff",
    },
  };
  const c = map[color];
  return (
    <button
      className="lp-icon-btn"
      onClick={onClick}
      style={{
        width: 31,
        height: 31,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: c.idle,
        color: c.idleC,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.18s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = c.hover;
        e.currentTarget.style.color = c.hoverC;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = c.idle;
        e.currentTarget.style.color = c.idleC;
      }}
    >
      <Icon size={13} />
    </button>
  );
};

// ═══════════════════════════════════════════
// TAB: HISTORI POIN
// ═══════════════════════════════════════════
const TabHistori = () => {
  const [pelangganList, setPelangganList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [histori, setHistori] = useState([]);
  const [pelangganInfo, setPelangganInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/pelanggan/")
      .then((r) => setPelangganList(r.data.data))
      .catch(() => {});
  }, []);

  const fetchHistori = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const [h, p] = await Promise.all([
        api.get(`/pelanggan/${id}/histori-poin`),
        api.get(`/pelanggan/${id}/poin`),
      ]);
      setHistori(h.data.data);
      setPelangganInfo(p.data.data);
    } catch {
      setHistori([]);
      setPelangganInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const filtered = histori.filter((h) =>
    (h.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Controls row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <FL>Pelanggan</FL>
          <Combo
            value={selectedId}
            onChange={(v) => {
              setSelectedId(v);
              fetchHistori(v);
            }}
            options={pelangganList.map((p) => ({
              value: p.id_pelanggan,
              nama_pelanggan: p.nama_pelanggan,
              kontak: p.kontak,
            }))}
            placeholder="Cari pelanggan..."
          />
        </div>
        {pelangganInfo && (
          <PoinChip
            nama={pelangganInfo.nama_pelanggan}
            poin={pelangganInfo.poin}
          />
        )}
        {selectedId && (
          <div style={{ flex: "0 0 200px", position: "relative" }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ink-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              className="lp-input"
              style={{ paddingLeft: 30, fontSize: 12 }}
              type="search"
              placeholder="Cari deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className="lp-scroll"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: 340,
          borderRadius: 14,
          border: "1.5px solid var(--border)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH center>No</TH>
              <TH>Tipe</TH>
              <TH>Poin</TH>
              <TH>Deskripsi</TH>
              <TH>Waktu</TH>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Skeletons cols={[30, 70, 50, 160, 110]} />
            ) : !selectedId ? (
              <Empty
                colSpan={5}
                icon={History}
                msg="Pilih pelanggan untuk melihat histori poin."
              />
            ) : filtered.length === 0 ? (
              <Empty
                colSpan={5}
                icon={History}
                msg="Tidak ada histori ditemukan."
              />
            ) : (
              filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className="lp-row"
                  style={{ background: "var(--white)" }}
                >
                  <TD center muted>
                    {idx + 1}
                  </TD>
                  <TD>
                    <Badge color={item.tipe === "earn" ? "green" : "red"}>
                      {item.tipe}
                    </Badge>
                  </TD>
                  <TD
                    bold
                    style={{
                      color:
                        item.tipe === "earn" ? "var(--green)" : "var(--rose)",
                    }}
                  >
                    {item.tipe === "earn" ? "+" : ""}
                    {item.poin}
                  </TD>
                  <TD>{item.deskripsi || "—"}</TD>
                  <TD muted style={{ fontSize: 12 }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("id-ID")
                      : "—"}
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// TAB: REWARD
// ═══════════════════════════════════════════
const TabReward = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    id_produk: "",
    nama_produk: "",
    poin_required: "",
  });
  const { alert, showAlert } = useAlert();

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/reward-poin/");
      setData(r.data.data);
    } catch {
      showAlert("error", "Gagal mengambil data reward.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.id_produk) {
      showAlert("error", "Pilih produk terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/reward-poin/", {
        id_produk: Number(newItem.id_produk),
        poin_required: Number(newItem.poin_required),
      });
      await load();
      setAddOpen(false);
      setNewItem({ id_produk: "", nama_produk: "", poin_required: "" });
      showAlert("success", "Reward berhasil ditambahkan.");
    } catch {
      showAlert("error", "Gagal menambahkan reward.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editItem.id_produk) {
      showAlert("error", "Pilih produk terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put(`/reward-poin/${editItem.id_reward}`, {
        id_produk: Number(editItem.id_produk),
        poin_required: Number(editItem.poin_required),
      });
      await load();
      setEditItem(null);
      showAlert("success", "Reward berhasil diubah.");
    } catch {
      showAlert("error", "Gagal mengubah reward.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus reward "${item.nama_produk}"?`)) return;
    try {
      await api.delete(`/reward-poin/${item.id_reward}`);
      await load();
      showAlert("success", "Reward berhasil dihapus.");
    } catch {
      showAlert("error", "Gagal menghapus reward.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Toast alert={alert} />

      <div
        className="lp-scroll"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: 340,
          borderRadius: 14,
          border: "1.5px solid var(--border)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH center>No</TH>
              <TH>Nama Produk</TH>
              <TH>Poin</TH>
              <TH>Aksi</TH>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Skeletons cols={[30, 200, 80, 70]} />
            ) : data.length === 0 ? (
              <Empty colSpan={4} icon={Gift} msg="Belum ada reward." />
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id_reward}
                  className="lp-row"
                  style={{ background: "var(--white)" }}
                >
                  <TD center muted>
                    {idx + 1}
                  </TD>
                  <TD bold>{item.nama_produk}</TD>
                  <TD>
                    <Badge>
                      <Star size={9} /> {Number(item.poin_required || 0)} poin
                    </Badge>
                  </TD>
                  <TD>
                    <div style={{ display: "flex", gap: 6 }}>
                      <IconBtn
                        icon={Pencil}
                        color="rose"
                        onClick={() => setEditItem({ ...item })}
                      />
                      <IconBtn
                        icon={Trash2}
                        color="red"
                        onClick={() => handleDelete(item)}
                      />
                    </div>
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div>
        <button
          className="lp-btn lp-primary"
          onClick={() => {
            setNewItem({ id_produk: "", nama_produk: "", poin_required: "" });
            setAddOpen(true);
          }}
        >
          <Plus size={14} /> Tambah Reward
        </button>
      </div>

      {addOpen && (
        <Modal title="Tambah Reward Poin" onClose={() => setAddOpen(false)}>
          <form
            onSubmit={handleAdd}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <FL>Produk</FL>
              <ProdukSearch
                value={{
                  id_produk: newItem.id_produk,
                  nama_produk: newItem.nama_produk,
                }}
                onChange={(v) => setNewItem((p) => ({ ...p, ...v }))}
              />
            </div>
            <div>
              <FL>Poin Dibutuhkan</FL>
              <input
                className="lp-input"
                type="number"
                min={1}
                required
                placeholder="contoh: 500"
                value={newItem.poin_required}
                onChange={(e) =>
                  setNewItem({ ...newItem, poin_required: e.target.value })
                }
              />
            </div>
            <MFooter
              onCancel={() => setAddOpen(false)}
              submitting={isSubmitting}
            />
          </form>
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Reward Poin" onClose={() => setEditItem(null)}>
          <form
            onSubmit={handleEdit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <FL>Produk</FL>
              <ProdukSearch
                value={{
                  id_produk: editItem.id_produk,
                  nama_produk: editItem.nama_produk,
                }}
                onChange={(v) => setEditItem((p) => ({ ...p, ...v }))}
              />
            </div>
            <div>
              <FL>Poin Dibutuhkan</FL>
              <input
                className="lp-input"
                type="number"
                min={1}
                required
                value={editItem.poin_required}
                onChange={(e) =>
                  setEditItem({ ...editItem, poin_required: e.target.value })
                }
              />
            </div>
            <MFooter
              onCancel={() => setEditItem(null)}
              submitting={isSubmitting}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// TAB: REDEEM
// ═══════════════════════════════════════════
const TabRedeem = () => {
  const [pelangganList, setPelangganList] = useState([]);
  const [rewardList, setRewardList] = useState([]);
  const [selectedPel, setSelectedPel] = useState("");
  const [pelangganInfo, setPelangganInfo] = useState(null);
  const [selectedReward, setSelectedReward] = useState("");
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    Promise.all([api.get("/pelanggan/"), api.get("/reward-poin/")])
      .then(([p, r]) => {
        setPelangganList(p.data.data);
        setRewardList(r.data.data);
      })
      .catch(() => {});
  }, []);

  const handlePelChange = async (id) => {
    setSelectedPel(id);
    setResult(null);
    if (!id) {
      setPelangganInfo(null);
      return;
    }
    try {
      const r = await api.get(`/pelanggan/${id}/poin`);
      setPelangganInfo(r.data.data);
    } catch {
      setPelangganInfo(null);
    }
  };

  const selRewardData = rewardList.find(
    (r) => String(r.id_reward) === String(selectedReward)
  );
  const totalPoin = selRewardData ? selRewardData.poin_required * qty : 0;
  const cukup = pelangganInfo ? pelangganInfo.poin >= totalPoin : true;

  const handleRedeem = async () => {
    if (!selectedPel || !selectedReward || qty < 1) {
      showAlert("error", "Lengkapi semua field.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setResult(null);
    try {
      const r = await api.post(`/pelanggan/${selectedPel}/redeem-poin`, {
        id_reward: Number(selectedReward),
        qty: Number(qty),
      });
      setResult(r.data.data);
      setPelangganInfo((p) => (p ? { ...p, poin: r.data.data.sisa_poin } : p));
      showAlert("success", "Redeem berhasil!");
    } catch (err) {
      showAlert(
        "error",
        err?.response?.data?.message || "Redeem gagal. Cek poin atau stok."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 460,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Toast alert={alert} />

      <div>
        <FL>Pelanggan</FL>
        <Combo
          value={selectedPel}
          onChange={handlePelChange}
          options={pelangganList.map((p) => ({
            value: p.id_pelanggan,
            nama_pelanggan: p.nama_pelanggan,
            kontak: p.kontak,
          }))}
          placeholder="Cari pelanggan..."
        />
      </div>

      {pelangganInfo && (
        <PoinChip
          nama={pelangganInfo.nama_pelanggan}
          poin={pelangganInfo.poin}
        />
      )}

      <div>
        <FL>Reward</FL>
        <Combo
          value={selectedReward}
          onChange={(v) => {
            setSelectedReward(v);
            setResult(null);
          }}
          options={rewardList.map((r) => ({
            value: r.id_reward,
            nama_pelanggan: r.nama_produk, // trick: biar Combo konsisten
            kontak: `${r.poin_required.toLocaleString(
              "id-ID"
            )} poin dibutuhkan`,
          }))}
          placeholder="Cari reward..."
        />
      </div>

      <div>
        <FL>Jumlah (Qty)</FL>
        <input
          className="lp-input"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => {
            setQty(e.target.value);
            setResult(null);
          }}
        />
      </div>

      {/* Summary */}
      {selRewardData && qty >= 1 && (
        <div
          style={{
            background:
              "linear-gradient(135deg,var(--surface-2),var(--rose-pale))",
            border: "1.5px solid var(--rose-border)",
            borderRadius: 13,
            padding: "13px 16px",
          }}
        >
          {[
            ["Reward", selRewardData.nama_produk],
            ["Poin / item", selRewardData.poin_required],
            ["Qty", qty],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--ink-muted)" }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div
            style={{
              borderTop: "1px solid var(--rose-border)",
              marginTop: 8,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>Total Poin</span>
            <span
              style={{ fontSize: 16, fontWeight: 800, color: "var(--rose)" }}
            >
              {totalPoin.toLocaleString("id-ID")}
            </span>
          </div>
          {pelangganInfo && !cukup && totalPoin > 0 && (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#B91C1C",
              }}
            >
              <AlertCircle size={12} /> Poin tidak mencukupi (
              {pelangganInfo.poin.toLocaleString("id-ID")} tersedia)
            </div>
          )}
        </div>
      )}

      <button
        className="lp-btn lp-primary full"
        onClick={handleRedeem}
        disabled={isSubmitting || !selectedPel || !selectedReward}
      >
        <RefreshCcw size={14} />
        {isSubmitting ? "Memproses..." : "Redeem Sekarang"}
      </button>

      {/* Result */}
      {result && (
        <div
          className="lp-fade"
          style={{
            background: "var(--green-pale)",
            border: "1.5px solid #A7F3D0",
            borderRadius: 13,
            padding: "15px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <CheckCircle2 size={15} style={{ color: "var(--green)" }} />
            <span
              style={{ fontWeight: 700, color: "var(--green)", fontSize: 14 }}
            >
              Redeem Berhasil!
            </span>
          </div>
          {[
            ["Produk", result.nama_produk],
            ["Qty", result.qty],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--ink-muted)" }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
              fontSize: 13,
            }}
          >
            <span style={{ color: "var(--ink-muted)" }}>Poin digunakan</span>
            <span style={{ fontWeight: 700, color: "var(--rose)" }}>
              −{result.poin_digunakan.toLocaleString("id-ID")}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid #A7F3D0",
              marginTop: 8,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13 }}>Sisa Poin</span>
            <span
              style={{ fontWeight: 800, color: "var(--green)", fontSize: 14 }}
            >
              {result.sisa_poin.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// TAB: PENGATURAN
// ═══════════════════════════════════════════
const TabPengaturan = () => {
  const [poinKelipatan, setPoinKelipatan] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    setLoading(true);
    api
      .get("/pengaturan/")
      .then((r) => {
        const v = String(r.data.data.poin_kelipatan);
        setPoinKelipatan(v);
        setOriginalValue(v);
      })
      .catch(() => showAlert("error", "Gagal mengambil pengaturan."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || Number(poinKelipatan) < 1) return;
    setIsSubmitting(true);
    try {
      await api.put("/pengaturan/", { poin_kelipatan: Number(poinKelipatan) });
      setOriginalValue(poinKelipatan);
      showAlert("success", "Pengaturan berhasil disimpan.");
    } catch {
      showAlert("error", "Gagal menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = poinKelipatan !== originalValue;
  const keli = Number(poinKelipatan || 35000);
  const preview = [1, 2, 3, 4].map((m) => ({ belanja: keli * m, poin: m }));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
      <Toast alert={alert} />

      {/* Form side */}
      <div style={{ flex: "1 1 240px", maxWidth: 320 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--rose-pale)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={14} color="var(--rose)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
            Aturan Perhitungan Poin
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[80, 220, 120].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 13, width: w }}
              />
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <FL>Kelipatan Belanja per Poin (Rp)</FL>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 12,
                    color: "var(--ink-muted)",
                    pointerEvents: "none",
                  }}
                >
                  Rp
                </span>
                <input
                  className="lp-input has-prefix"
                  type="number"
                  min={1}
                  required
                  value={poinKelipatan}
                  onChange={(e) => setPoinKelipatan(e.target.value)}
                />
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--ink-muted)",
                }}
              >
                Setiap{" "}
                <strong style={{ color: "var(--rose)" }}>
                  Rp{Number(poinKelipatan || 0).toLocaleString("id-ID")}
                </strong>{" "}
                = 1 poin
              </div>
            </div>
            <button
              type="submit"
              className="lp-btn lp-primary full"
              disabled={isSubmitting || !isDirty}
            >
              <Save size={13} />{" "}
              {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            {!isDirty && !loading && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                }}
              >
                Tidak ada perubahan.
              </div>
            )}
          </form>
        )}
      </div>

      {/* Preview side */}
      <div style={{ flex: "1 1 200px", maxWidth: 300 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--gold-pale)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={14} color="var(--gold)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
            Preview Perhitungan
          </span>
        </div>
        <div
          style={{
            border: "1.5px solid var(--border)",
            borderRadius: 13,
            overflow: "hidden",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <TH>Total Belanja</TH>
                <TH center>Poin</TH>
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--white)",
                  }}
                >
                  <td style={{ padding: "10px 14px", color: "var(--ink)" }}>
                    Rp{row.belanja.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <Badge>
                      <Star size={9} /> {row.poin}
                    </Badge>
                  </td>
                </tr>
              ))}
              <tr style={{ background: "var(--surface-2)" }}>
                <td
                  style={{
                    padding: "9px 14px",
                    fontSize: 11,
                    color: "var(--ink-muted)",
                    fontStyle: "italic",
                  }}
                >
                  Rp{Math.floor(keli * 0.8).toLocaleString("id-ID")} (sisa)
                </td>
                <td
                  style={{
                    padding: "9px 14px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "var(--ink-muted)",
                  }}
                >
                  0
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 7, fontSize: 11, color: "var(--ink-muted)" }}>
          * Berlaku kelipatan. Sisa belanja tidak dihitung.
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
const role = localStorage.getItem("role");

const LoyaltyPoin = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const TABS = [
    {
      key: "redeem",
      label: "Redeem Poin",
      icon: RefreshCcw,
      roles: ["admin", "kasir"],
    },
    {
      key: "histori",
      label: "Histori Poin",
      icon: History,
      roles: ["admin", "kasir"],
    },
    { key: "reward", label: "Reward Poin", icon: Gift, roles: ["admin"] },
    {
      key: "pengaturan",
      label: "Pengaturan",
      icon: Settings,
      roles: ["admin"],
    },
  ].filter((t) => t.roles.includes(role));
  const [activeTab, setActiveTab] = useState("redeem");
  return (
    <div>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 20,
        }}
      >
        Loyalty Poin
      </h1>

      {/* Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1.5px solid var(--border)",
          boxShadow: "0 2px 16px rgba(26,17,24,0.05)",
          padding: "20px 24px 24px",
        }}
      >
        {/* Tab bar */}
        <div
          className="lp-tabs-bar"
          style={{
            display: "flex",
            gap: 2,
            borderBottom: "2px solid var(--border)",
            marginBottom: 22,
            overflowX: "auto",
          }}
        >
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`lp-tab${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lp-fade" key={activeTab}>
          {activeTab === "histori" && <TabHistori />}
          {activeTab === "reward" && <TabReward />}
          {activeTab === "redeem" && <TabRedeem />}
          {activeTab === "pengaturan" && <TabPengaturan />}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoin;
