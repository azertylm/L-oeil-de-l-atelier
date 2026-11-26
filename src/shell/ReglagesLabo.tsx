import { useEffect, useRef, useState } from 'react';
import { surLeLaboratoire } from './labo/confidentialite';
import { collecterPasseport, deposerPasseport, DUREE_RELAIS_SECONDES, type Depot } from './passeport';

/**
 * Réglages du panneau « Mon compte » : mode Codex (alphabette.eu) et transfert chiffré vers un autre appareil.
 * Aucune pop-up : tout se passe dans le panneau que l'utilisateur a ouvert lui-même.
 */

const CLE_CODEX = 'alphabette.codex';

/** Mode Codex : activé par défaut sur alphabette.eu, jamais sur alphabette.fr. */
export function codexActif(): boolean {
  if (!surLeLaboratoire()) return false;
  try { return localStorage.getItem(CLE_CODEX) !== 'non'; } catch { return true; }
}
export function poserCodex(actif: boolean): void {
  try { localStorage.setItem(CLE_CODEX, actif ? 'oui' : 'non'); } catch { /* navigation privée */ }
  if (actif) document.documentElement.setAttribute('data-ab-codex', 'oui');
  else document.documentElement.removeAttribute('data-ab-codex');
}

/** Dessine un QR dans le navigateur : charge assets/qr-alphabette.js (même origine) si besoin. Aucun service extérieur. */
export function chargerQr(): Promise<((texte: string) => string) | null> {
  const w = window as unknown as { qrSvg?: (t: string) => string };
  if (w.qrSvg) return Promise.resolve(w.qrSvg);
  const charger = (src: string) => new Promise<void>((ok, ko) => {
    const s = document.createElement('script');
    s.src = src; s.async = false; s.onload = () => ok(); s.onerror = () => ko(new Error(src));
    document.head.appendChild(s);
  });
  return charger('/assets/qrcode.js').then(() => charger('/assets/qr-alphabette.js')).then(() => w.qrSvg ?? null).catch(() => null);
}

/** Origine du relais : le Laboratoire (alphabette.eu), même quand on règle depuis une autre application. */
export function origineRelais(): string {
  const l = location;
  return /(^|\.)alphabette\.eu$/i.test(l.hostname) || /^(localhost|127\.0\.0\.1)$/.test(l.hostname) ? l.origin : 'https://alphabette.eu';
}

export function TransfertAppareil() {
  const [avecCles, setAvecCles] = useState(false);
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'pret' | 'expire' | 'erreur'>('repos');
  const [message, setMessage] = useState('');
  const [depot, setDepot] = useState<Depot | null>(null);
  const [qr, setQr] = useState('');
  const [reste, setReste] = useState(0);
  const fin = useRef(0);

  useEffect(() => {
    if (etat !== 'pret') return undefined;
    const t = window.setInterval(() => {
      const r = Math.max(0, Math.ceil((fin.current - Date.now()) / 1000));
      setReste(r);
      if (r === 0) { setEtat('expire'); setDepot(null); setQr(''); }
    }, 500);
    return () => window.clearInterval(t);
  }, [etat]);

  const creer = async () => {
    setEtat('envoi'); setMessage('');
    try {
      const d = await deposerPasseport(collecterPasseport({ avecCles }), origineRelais());
      const dessiner = await chargerQr();
      fin.current = Date.now() + d.expireDans * 1000;
      setReste(d.expireDans); setDepot(d); setQr(dessiner ? dessiner(d.lien) : ''); setEtat('pret');
    } catch (e) {
      setEtat('erreur'); setMessage(e instanceof Error ? e.message : 'Le transfert a échoué.');
    }
  };
  const copier = async () => {
    try { await navigator.clipboard.writeText(depot?.lien ?? ''); setMessage('Lien copié.'); } catch { setMessage('Copie impossible : sélectionnez le lien à la main.'); }
  };

  return (
    <div className="ab-panneau ab-transfert">
      <h4>📲 Transférer vers un autre appareil</h4>
      <p>Retrouvez vos réglages (thème, taille BIG, Mode Calme, favoris) sur votre téléphone ou votre ordinateur en scannant un QR code. Tout est chiffré sur cet appareil : le serveur ne garde qu’un bloc illisible pendant {DUREE_RELAIS_SECONDES} secondes, et la clé de déchiffrement ne lui est jamais envoyée.</p>
      <label className="ab-transfert__case">
        <input type="checkbox" checked={avecCles} onChange={(e) => setAvecCles(e.target.checked)} disabled={etat === 'envoi'} />
        <span>Inclure aussi mes clés d’IA (BYOK). <em>Décoché par défaut : à ne cocher que pour vos propres appareils.</em></span>
      </label>
      {etat !== 'pret' && (
        <button type="button" className="ab-btn ab-btn--accent ab-btn--lg" onClick={creer} disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Préparation…' : etat === 'expire' ? 'Créer un nouveau QR code' : 'Créer le QR code'}
        </button>
      )}
      {etat === 'pret' && depot && (
        <div className="ab-transfert__resultat" role="status">
          {qr ? <div className="ab-transfert__qr" dangerouslySetInnerHTML={{ __html: qr }} aria-label="QR code de transfert" role="img" /> : <p>QR indisponible : utilisez le lien ci-dessous.</p>}
          <p>Code de contrôle : <strong className="ab-transfert__code">{depot.code}</strong> · valable encore <strong>{reste} s</strong>, utilisable une seule fois.</p>
          <p className="ab-note">Scannez avec l’appareil photo de l’autre appareil, ou copiez le lien.</p>
          <button type="button" className="ab-btn ab-btn--ghost" onClick={copier}>Copier le lien</button>
        </div>
      )}
      {etat === 'expire' && <p role="status">Ce QR code a expiré (il ne vit que {DUREE_RELAIS_SECONDES} secondes, par sécurité).</p>}
      {message && <p className="ab-note" role="status">{message}</p>}
    </div>
  );
}

export function ReglagesLabo() {
  const labo = surLeLaboratoire();
  const [codex, setCodex] = useState(() => codexActif());
  return (
    <>
      {labo && (
        <div className="ab-panneau">
          <h4>🎨 Apparence</h4>
          <label className="ab-transfert__case">
            <input type="checkbox" checked={codex} onChange={(e) => { setCodex(e.target.checked); poserCodex(e.target.checked); }} />
            <span><strong>Mode Codex</strong> : rendu parchemin et encre de carnet d’inventeur. Décochez-le pour revenir à un rendu plus neutre.</span>
          </label>
        </div>
      )}
      <TransfertAppareil />
    </>
  );
}
