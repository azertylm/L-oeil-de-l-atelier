import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { AlphaAppConfig } from './config';
import { DENSITY_LABELS, DENSITY_ORDER } from './hooks';
import { useShell } from './ShellContext';

interface AppHeaderProps {
  app: AlphaAppConfig;
  /** Ouvre un menu de navigation propre à l'application (bouton ☰), s'il existe. */
  onToggleNav?: () => void;
}

/**
 * Barre 2 — « application ».
 *
 * Nom + sous-titre, puis quatre boutons toujours visibles, tous en pictogrammes :
 *   ♥ don · BIG · ☀️/🌙 · 🔊
 * et un menu « ⋯ » qui range le reste (favoris, mode simple, installer, avis,
 * imprimer, langue, compte, clé d'IA, plein écran). Rien ne dépasse de l'écran.
 */
export function AppHeader({ app, onToggleNav }: AppHeaderProps) {
  const sh = useShell();
  const { t } = sh;
  const [menu, setMenu] = useState(false);
  const zone = useRef<HTMLDivElement | null>(null);

  // Le menu se ferme au clic ailleurs et avec Échap.
  useEffect(() => {
    if (!menu) return;
    const dehors = (e: Event) => {
      if (zone.current && !zone.current.contains(e.target as Node)) setMenu(false);
    };
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('mousedown', dehors);
    document.addEventListener('touchstart', dehors);
    document.addEventListener('keydown', touche);
    return () => {
      document.removeEventListener('mousedown', dehors);
      document.removeEventListener('touchstart', dehors);
      document.removeEventListener('keydown', touche);
    };
  }, [menu]);

  const rang = DENSITY_ORDER.indexOf(sh.density);
  const tailleTexte = `${t('Taille du texte')} : ${t(DENSITY_LABELS[sh.density])}`;
  const epingle = sh.favoris.includes(app.key);
  const nuit = sh.theme === 'nuit';

  const entree = (emoji: ReactNode, mot: string, action: () => void, etat?: boolean) => (
    <button
      type="button"
      className="ab-menu__item"
      aria-pressed={etat}
      onClick={() => {
        setMenu(false);
        action();
      }}
    >
      <span className="ab-menu__emoji" aria-hidden="true">
        {emoji}
      </span>
      <span>{mot}</span>
    </button>
  );

  return (
    <div className="ab-bar">
      {onToggleNav && (
        <button type="button" className="ab-pico" onClick={onToggleNav} aria-label="Menu" data-ab-tip="Menu">
          ☰
        </button>
      )}

      <div className="ab-bar__identity">
        {app.icon && <span aria-hidden="true">{app.icon}</span>}
        <div className="ab-bar__titles">
          <span className="ab-bar__name">{app.name}</span>
          <span className="ab-bar__tagline">{app.tagline}</span>
        </div>
      </div>

      <div className="ab-bar__actions" ref={zone}>
        <button
          type="button"
          className="ab-pico ab-pico--don"
          onClick={() => sh.openPanel('dons')}
          data-ab-tip={t('Faire un don')}
          aria-label={t('Faire un don')}
        >
          ♥
        </button>

        <button
          type="button"
          className="ab-pico ab-pico--big"
          onClick={sh.cycleDensity}
          data-ab-tip={tailleTexte}
          aria-label={`BIG, ${tailleTexte}`}
        >
          <span>BIG</span>
          <span className="ab-density" aria-hidden="true">
            {DENSITY_ORDER.map((etape, i) => (
              <span key={etape} className={`ab-density__bar${i <= rang ? ' ab-density__bar--on' : ''}`} />
            ))}
          </span>
        </button>

        <button
          type="button"
          className="ab-pico ab-pico--theme"
          onClick={sh.toggleTheme}
          data-ab-tip={nuit ? t('Passer en mode jour') : t('Passer en mode nuit')}
          aria-label={nuit ? t('Passer en mode jour') : t('Passer en mode nuit')}
        >
          {nuit ? '🌙' : '☀️'}
        </button>

        {sh.lecture.possible && (
          <button
            type="button"
            className={`ab-pico${sh.lecture.enCours ? ' ab-pico--actif' : ''}`}
            onClick={sh.lecture.basculer}
            data-ab-tip={sh.lecture.enCours ? t('Arrêter la lecture') : t('Lire à voix haute')}
            aria-label={sh.lecture.enCours ? t('Arrêter la lecture') : t('Lire à voix haute')}
          >
            {sh.lecture.enCours ? '⏹️' : '🔊'}
          </button>
        )}

        <button
          type="button"
          className={`ab-pico${menu ? ' ab-pico--actif' : ''}`}
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-haspopup="true"
          data-ab-tip={t('Plus d’options')}
          aria-label={t('Plus d’options')}
        >
          ⋯
        </button>

        {menu && (
          <div className="ab-menu" role="menu">
            {entree(epingle ? '★' : '⭐', epingle ? t('Retirer de mes favoris') : t('Épingler cette appli'), () => sh.basculerFavori(app.key), epingle)}
            {entree('🧘', sh.simple ? t('Quitter le mode simple') : t('Mode simple'), sh.basculerSimple, sh.simple)}
            {!sh.installation.installee &&
              entree('📲', t('Installer sur mon téléphone'), async () => {
                if (!(await sh.installation.installer())) sh.openPanel('installer');
              })}
            {entree('💬', t('Donner mon avis'), sh.donnerAvis)}
            {entree('🖨️', t('Imprimer'), sh.imprimer)}
            {entree('🌍', t('Langue'), () => sh.openPanel('langue'))}
            {entree('👤', t('Mon compte'), sh.openAccount)}
            {entree('🔑', t('Clé d’IA'), sh.openApiKeys)}
            {entree('⛶', sh.isFullscreen ? t('Quitter le plein écran') : t('Plein écran'), sh.toggleFullscreen)}
          </div>
        )}
      </div>
    </div>
  );
}
