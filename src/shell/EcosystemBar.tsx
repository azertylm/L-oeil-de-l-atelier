import { useEffect, useState } from 'react';
import type { AlphaAppConfig, AlphaSite } from './config';
import type { EcosystemApp } from './apps';
import { useShell } from './ShellContext';
import { lireMembre, type Membre } from './membre';
import { MeteoPastille } from './MeteoPastille';
import { surLeLaboratoire } from './labo/confidentialite';

/** L'inscription de ce navigateur, relue quand on revient sur l'onglet. */
function useMembre(): Membre | null {
  const [membre, setMembre] = useState<Membre | null>(() => lireMembre());
  useEffect(() => {
    const relire = () => setMembre(lireMembre());
    window.addEventListener('focus', relire);
    document.addEventListener('visibilitychange', relire);
    window.addEventListener('alphabette:membre', relire);
    return () => {
      window.removeEventListener('focus', relire);
      document.removeEventListener('visibilitychange', relire);
      window.removeEventListener('alphabette:membre', relire);
    };
  }, []);
  return membre;
}

interface EcosystemBarProps {
  app: AlphaAppConfig;
  sites: AlphaSite[];
  hubUrl: string;
  /** Applications du registre (pour retrouver les favoris). */
  apps: EcosystemApp[];
}

/**
 * Barre 1 — « écosystème ».
 *
 * Volontairement courte pour ne jamais dépasser de l'écran, même sur téléphone :
 *   [α alphabette]  [▦ toutes les applis] [🆕 nouveautés]  (favoris)  [S'abonner | 👤 Prénom]
 *
 * · « alphabette » est écrit petit et ramène à www.alphabette.fr ;
 * · chaque pictogramme affiche son nom au survol, au clavier et au doigt ;
 * · les favoris (3 au maximum) apparaissent à partir de la tablette.
 */
export function EcosystemBar({ app, hubUrl, apps }: EcosystemBarProps) {
  const { t, favoris, nouveautesNonVues, openPanel, openPayment } = useShell();
  const membre = useMembre();
  const [octetOk, setOctetOk] = useState(true);
  const favorisApps = favoris
    .map((cle) => apps.find((a) => a.key === cle))
    .filter((a): a is EcosystemApp => Boolean(a));

  return (
    <div className="ab-eco">
      <a
        className="ab-eco__logo"
        href={hubUrl.includes('alphabette') ? 'https://www.alphabette.fr' : hubUrl}
        data-ab-tip={t('Aller sur alphabette.fr')}
        aria-label={t('Aller sur alphabette.fr')}
      >
        <span className="ab-eco__brand-mark" aria-hidden="true">
          α
        </span>
        <span>alphabette</span>
      </a>

      <button
        type="button"
        className="ab-eco__icone"
        onClick={() => openPanel('sites')}
        data-ab-tip={t('Toutes les applis')}
        aria-label={t('Toutes les applis')}
      >
        ▦
      </button>

      <button
        type="button"
        className="ab-eco__icone"
        onClick={() => openPanel('nouveautes')}
        data-ab-tip={t('Nouveautés')}
        aria-label={t('Nouveautés')}
      >
        🆕
        {nouveautesNonVues > 0 && <span className="ab-eco__point" aria-hidden="true" />}
      </button>

      {/* Laboratoire d'Octet : depuis alphabette.fr il mène à alphabette.eu (tester et proposer des idées) ; sur .eu il ouvre la section d'idées. */}
      <a
        className={`ab-eco__icone ab-eco__labo${octetOk ? '' : ' ab-eco__labo--txt'}`}
        href={surLeLaboratoire() ? '/#idees' : 'https://alphabette.eu/#idees'}
        data-ab-tip={t('Laboratoire d’Octet : tester et proposer des idées')}
        aria-label={t('Laboratoire d’Octet : tester et proposer des idées')}
      >
        {octetOk && (
          <img className="ab-eco__octet" src="https://alphabette.fr/assets/octet/octet-icone.webp" alt="" width={28} height={28} decoding="async" aria-hidden="true" onError={() => setOctetOk(false)} />
        )}
        <span className="ab-eco__labo-txt">{t('Laboratoire')}</span>
      </a>

      <nav className="ab-eco__favoris" aria-label={t('Mes favoris')}>
        {favorisApps.map((fav) =>
          fav.key === app.key || !fav.url ? (
            <span key={fav.key} className="ab-site ab-site--active" aria-current={fav.key === app.key ? 'page' : undefined}>
              ★ {fav.name}
            </span>
          ) : (
            <a key={fav.key} className="ab-site" href={fav.url}>
              ★ {fav.name}
            </a>
          ),
        )}
      </nav>

      <div className="ab-eco__right">
        {/* Météo du Labo : uniquement sur alphabette.eu (jamais sur alphabette.fr). */}
        {surLeLaboratoire() && <MeteoPastille />}
        {membre ? (
          <button
            type="button"
            className="ab-abonner ab-abonner--membre"
            onClick={() => openPanel('compte')}
            data-ab-tip={t('Mon inscription')}
            aria-label={`${t('Mon inscription')} : ${membre.prenom}`}
          >
            👤 {membre.prenom}
          </button>
        ) : (
          <button type="button" className="ab-abonner" onClick={openPayment}>
            ⭐ {t('S’abonner')}
          </button>
        )}
      </div>
    </div>
  );
}
