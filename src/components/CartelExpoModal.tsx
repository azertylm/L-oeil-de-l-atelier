/**
 * Générateur de cartel d'exposition — cartel normalisé, prêt à imprimer en planche A4,
 * avec un QR code dessiné localement en SVG (qrcode.react : aucun service extérieur).
 * Le QR n'apparaît que si un lien est saisi, et le cartel dit vers où il mène.
 */
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { Printer, X } from "lucide-react";

type Format = "standard" | "grand";

const FORMATS: Record<Format, { libelle: string; l: number; h: number; parPage: number; qr: number; texteMax: number }> = {
  standard: { libelle: "Standard 10 × 7 cm — 8 par page", l: 100, h: 70, parPage: 8, qr: 21, texteMax: 160 },
  grand: { libelle: "Grand 10 × 14 cm — 4 par page", l: 100, h: 140, parPage: 4, qr: 30, texteMax: 420 },
};

interface Champs {
  artiste: string;
  titre: string;
  annee: string;
  technique: string;
  dimensions: string;
  texte: string;
  mention: string;
  lien: string;
}

const CLE = "atelier.cartelExpo.v1";

/** Lien sûr pour le QR : http(s) ou mailto uniquement ; « monsite.fr » devient https://monsite.fr. */
function lienSur(brut: string): string | null {
  const v = brut.trim();
  if (!v) return null;
  if (/^mailto:[^\s]+@[^\s]+$/i.test(v)) return v;
  const avecSchema = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
  try {
    const u = new URL(avecSchema);
    if ((u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".")) return u.href;
  } catch { /* lien invalide */ }
  return null;
}

function affichageLien(lien: string): string {
  if (lien.startsWith("mailto:")) return lien.slice(7).split("?")[0];
  try {
    const u = new URL(lien);
    return (u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname : "")).slice(0, 48);
  } catch {
    return lien.slice(0, 48);
  }
}

const Cartel: React.FC<{ c: Champs; format: Format; lien: string | null }> = ({ c, format, lien }) => {
  const f = FORMATS[format];
  const grand = format === "grand";
  return (
    <div
      className="cartel-expo"
      style={{
        width: `${f.l}mm`, height: `${f.h}mm`, boxSizing: "border-box", padding: grand ? "9mm 8mm" : "6mm 6.5mm",
        background: "#fff", color: "#111", fontFamily: 'Georgia, "Times New Roman", serif',
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, fontSize: grand ? "15pt" : "12.5pt", lineHeight: 1.15, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
        {c.artiste || "Nom de l'artiste"}
      </p>
      <p style={{ margin: "1.6mm 0 0", fontStyle: "italic", fontSize: grand ? "15pt" : "12.5pt", lineHeight: 1.2 }}>
        {c.titre || "Titre de l'œuvre"}
        {c.annee ? <span style={{ fontStyle: "normal" }}>, {c.annee}</span> : null}
      </p>
      {c.technique && <p style={{ margin: "1.6mm 0 0", fontSize: grand ? "11pt" : "9.5pt", lineHeight: 1.3 }}>{c.technique}</p>}
      {c.dimensions && <p style={{ margin: "0.6mm 0 0", fontSize: grand ? "11pt" : "9.5pt", lineHeight: 1.3 }}>{c.dimensions}</p>}
      {c.texte && (
        <p style={{ margin: grand ? "5mm 0 0" : "2.2mm 0 0", fontSize: grand ? "10.5pt" : "8.5pt", lineHeight: 1.4, color: "#222" }}>
          {c.texte.slice(0, f.texteMax)}
        </p>
      )}
      <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "3mm" }}>
        <p style={{ margin: 0, fontSize: grand ? "10.5pt" : "9pt", fontWeight: 700, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
          {c.mention}
        </p>
        {lien && (
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <QRCodeSVG value={lien} size={256} level="M" marginSize={0} title={`QR code vers ${affichageLien(lien)}`} style={{ width: `${f.qr}mm`, height: `${f.qr}mm`, display: "block" }} />
            <p style={{ margin: "1mm 0 0", fontSize: "6.5pt", lineHeight: 1.2, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif', maxWidth: `${f.qr + 14}mm`, wordBreak: "break-all" }}>
              {affichageLien(lien)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  artiste?: string;
  titre?: string;
  annee?: string;
  technique?: string;
  dimensions?: string;
  lienParDefaut?: string;
}

export default function CartelExpoModal({ isOpen, onClose, theme = "dark-gold", artiste, titre, annee, technique, dimensions, lienParDefaut }: Props) {
  const sombre = theme === "dark-gold";
  const [format, setFormat] = useState<Format>("standard");
  const [c, setC] = useState<Champs>({ artiste: "", titre: "", annee: "", technique: "", dimensions: "", texte: "", mention: "", lien: "" });

  // À l'ouverture : l'œuvre en cours + ce qui a été retenu la dernière fois (artiste, mention, lien).
  useEffect(() => {
    if (!isOpen) return;
    let memo: Partial<Champs> & { format?: Format } = {};
    try { memo = JSON.parse(localStorage.getItem(CLE) || "{}"); } catch { /* stockage indisponible */ }
    setC({
      artiste: memo.artiste || artiste || "",
      titre: titre || "",
      annee: annee || "",
      technique: technique || "",
      dimensions: dimensions || "",
      texte: "",
      mention: memo.mention || "",
      lien: memo.lien || lienParDefaut || "",
    });
    if (memo.format === "grand" || memo.format === "standard") setFormat(memo.format);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    try { localStorage.setItem(CLE, JSON.stringify({ artiste: c.artiste, mention: c.mention, lien: c.lien, format })); } catch { /* rien */ }
  }, [c.artiste, c.mention, c.lien, format, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const echap = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [isOpen, onClose]);

  const lien = useMemo(() => lienSur(c.lien), [c.lien]);
  if (!isOpen) return null;
  const f = FORMATS[format];
  const maj = (k: keyof Champs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setC({ ...c, [k]: e.target.value });

  const couleurs = sombre
    ? { fond: "#0d0d0d", texte: "#f5f0e6", doux: "#c8c0b0", accent: "#c9a84c", champ: "#1a1a1a", bord: "#4a4436" }
    : { fond: "#faf7f0", texte: "#1c1917", doux: "#57534e", accent: "#7a5f14", champ: "#ffffff", bord: "#c9bfa8" };
  const champ: React.CSSProperties = { width: "100%", minHeight: 44, padding: "10px 12px", borderRadius: 10, border: `2px solid ${couleurs.bord}`, background: couleurs.champ, color: couleurs.texte, fontSize: 16, boxSizing: "border-box" };
  const etiquette: React.CSSProperties = { display: "grid", gap: 4, fontSize: 14, fontWeight: 700 };

  const planche = createPortal(
    <div className="planche-cartel-expo" aria-hidden="true">
      {Array.from({ length: f.parPage }, (_, i) => <Cartel key={i} c={c} format={format} lien={lien} />)}
    </div>,
    document.body,
  );

  return (
    <>
      <style>{`
        .planche-cartel-expo { display: none; }
        .cartel-expo-champ:focus-visible, .cartel-expo-bouton:focus-visible { outline: 3px solid ${couleurs.accent}; outline-offset: 2px; }
        @media (max-width: 420px) { .cartel-expo-apercu { zoom: 0.84; } }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { background: #fff !important; height: auto !important; overflow: visible !important; }
          body > *:not(.planche-cartel-expo) { display: none !important; }
          .planche-cartel-expo {
            display: grid !important; grid-template-columns: repeat(2, ${f.l}mm); grid-auto-rows: ${f.h}mm;
            justify-content: center; align-content: center; width: 210mm; height: 296mm; margin: 0; padding: 0;
            print-color-adjust: exact; -webkit-print-color-adjust: exact;
          }
          .planche-cartel-expo .cartel-expo { outline: 0.2mm dashed #9a9a9a; outline-offset: -0.1mm; break-inside: avoid; }
        }
      `}</style>
      {planche}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartel-expo-titre"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.78)", overflowY: "auto", padding: "12px" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: 760, margin: "0 auto", background: couleurs.fond, color: couleurs.texte, border: `1px solid ${couleurs.bord}`, borderRadius: 16, padding: "18px 16px 22px", fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 800, color: couleurs.accent }}>L'Œil de l'Atelier</p>
              <h2 id="cartel-expo-titre" style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 900, lineHeight: 1.15 }}>Cartel d'exposition</h2>
              <p style={{ margin: "6px 0 0", fontSize: 15, color: couleurs.doux, lineHeight: 1.45 }}>
                Remplissez, vérifiez l'aperçu, imprimez : une planche A4 prête à découper. Le QR code est dessiné sur votre appareil, sans service extérieur.
              </p>
            </div>
            <button type="button" className="cartel-expo-bouton" onClick={onClose} aria-label="Fermer" style={{ minWidth: 44, minHeight: 44, borderRadius: 10, border: `2px solid ${couleurs.bord}`, background: "transparent", color: couleurs.texte, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div style={{ display: "grid", gap: 12, marginTop: 18, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            <label style={etiquette}>Artiste<input className="cartel-expo-champ" style={champ} value={c.artiste} onChange={maj("artiste")} maxLength={80} autoComplete="name" /></label>
            <label style={etiquette}>Titre de l'œuvre<input className="cartel-expo-champ" style={champ} value={c.titre} onChange={maj("titre")} maxLength={120} /></label>
            <label style={etiquette}>Année<input className="cartel-expo-champ" style={champ} value={c.annee} onChange={maj("annee")} maxLength={20} inputMode="numeric" /></label>
            <label style={etiquette}>Technique<input className="cartel-expo-champ" style={champ} value={c.technique} onChange={maj("technique")} maxLength={120} placeholder="Huile sur toile" /></label>
            <label style={etiquette}>Format<input className="cartel-expo-champ" style={champ} value={c.dimensions} onChange={maj("dimensions")} maxLength={60} placeholder="81 × 65 cm" /></label>
            <label style={etiquette}>Mention (prix, collection…)<input className="cartel-expo-champ" style={champ} value={c.mention} onChange={maj("mention")} maxLength={60} placeholder="1 200 € — ou « Collection particulière »" /></label>
          </div>

          <label style={{ ...etiquette, marginTop: 12 }}>
            Lien du QR code (facultatif)
            <input className="cartel-expo-champ" style={champ} value={c.lien} onChange={maj("lien")} maxLength={300} placeholder="monsite.fr/oeuvre ou mailto:atelier@exemple.fr" inputMode="url" />
          </label>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: c.lien && !lien ? "#e0605a" : couleurs.doux }} role={c.lien && !lien ? "alert" : undefined}>
            {!c.lien ? "Sans lien, le cartel est imprimé sans QR code." : lien ? `Le QR code mènera à : ${affichageLien(lien)}` : "Ce lien n'est pas valide : indiquez une adresse web (monsite.fr) ou mailto:."}
          </p>

          <label style={{ ...etiquette, marginTop: 12 }}>
            Texte court (facultatif — {c.texte.length}/{f.texteMax} caractères)
            <textarea className="cartel-expo-champ" style={{ ...champ, minHeight: 84, resize: "vertical", lineHeight: 1.45 }} value={c.texte} onChange={maj("texte")} maxLength={f.texteMax} />
          </label>

          <fieldset style={{ border: 0, padding: 0, margin: "14px 0 0" }}>
            <legend style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Taille du cartel</legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(Object.keys(FORMATS) as Format[]).map((k) => (
                <label key={k} style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderRadius: 10, border: `2px solid ${format === k ? couleurs.accent : couleurs.bord}`, cursor: "pointer", fontSize: 15, fontWeight: format === k ? 800 : 500 }}>
                  <input type="radio" name="format-cartel" checked={format === k} onChange={() => setFormat(k)} style={{ width: 18, height: 18, accentColor: couleurs.accent }} />
                  {FORMATS[k].libelle}
                </label>
              ))}
            </div>
          </fieldset>

          <h3 style={{ margin: "20px 0 8px", fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: couleurs.accent }}>Aperçu à taille réelle</h3>
          <div className="cartel-expo-apercu" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.35)", border: "1px solid #d6d3d1" }}>
              <Cartel c={c} format={format} lien={lien} />
            </div>
          </div>

          <button
            type="button"
            className="cartel-expo-bouton"
            onClick={() => window.print()}
            style={{ marginTop: 18, width: "100%", minHeight: 52, borderRadius: 12, border: 0, background: couleurs.accent, color: sombre ? "#0d0d0d" : "#ffffff", fontWeight: 900, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <Printer size={20} aria-hidden="true" /> Imprimer ({f.parPage} cartels par A4)
          </button>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: couleurs.doux, textAlign: "center" }}>
            Dans la fenêtre d'impression : échelle 100 %, sans marges ajoutées. Ou choisissez « Enregistrer en PDF ».
          </p>
        </div>
      </div>
    </>
  );
}
