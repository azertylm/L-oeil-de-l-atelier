import type { AlphaAppConfig } from './config';
import {
  IconDot,
  IconHeart,
  IconKey,
  IconMaximize,
  IconMenu,
  IconMinimize,
  IconMoon,
  IconSun,
  IconUser,
} from './icons';
import type { ShellStatus } from './config';
import { DENSITY_LABELS, DENSITY_ORDER, type ShellDensity } from './hooks';

interface AppHeaderProps {
  app: AlphaAppConfig;
  density: ShellDensity;
  theme: 'jour' | 'nuit';
  isFullscreen: boolean;
  isImmersion: boolean;
  onToggleDensity: () => void;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onOpenAccount: () => void;
  onOpenApiKeys: () => void;
  onOpenDon: () => void;
  onToggleNav?: () => void;
}

const statusLabel: Record<ShellStatus, string> = {
  ok: 'Prêt',
  loading: '…',
  off: 'Non configurée',
};

/**
 * Barre 2 — « application ».
 * Nom de l'app + sous-titre, puis : dons, compte, densité (BIG), clés d'API,
 * plein écran et bascule jour/nuit. Chaque bouton ouvre un panneau concret.
 */
export function AppHeader({
  app,
  density,
  theme,
  isFullscreen,
  isImmersion,
  onToggleDensity,
  onToggleTheme,
  onToggleFullscreen,
  onOpenAccount,
  onOpenApiKeys,
  onOpenDon,
  onToggleNav,
}: AppHeaderProps) {
  const activeIndex = DENSITY_ORDER.indexOf(density);
  const apiKeyState = app.apiKeyState ?? 'ok';
  const accountState = app.accountState ?? 'ok';

  return (
    <div className="ab-bar">
      {onToggleNav && (
        <button
          type="button"
          className="ab-icon-btn ab-actions__hide-sm"
          onClick={onToggleNav}
          aria-label="Ouvrir le menu"
        >
          <IconMenu />
        </button>
      )}

      <div className="ab-bar__identity">
        {app.icon && <span aria-hidden="true">{app.icon}</span>}
        <div className="ab-bar__titles">
          <span className="ab-bar__name">{app.name}</span>
          <span className="ab-bar__tagline">{app.tagline}</span>
        </div>
      </div>

      <div className="ab-bar__actions">
        <button type="button" className="ab-btn ab-btn--don" onClick={onOpenDon} title="Soutenir le projet (dons)">
          <IconHeart width={13} height={13} />
          <span>DON</span>
        </button>

        <button
          type="button"
          className="ab-btn ab-btn--ghost"
          onClick={onOpenAccount}
          title="Mon compte alphabette"
        >
          <IconUser width={14} height={14} />
          <span className="ab-btn__texte-large">Mon Compte</span>
          <span className={`ab-status ab-status--${accountState}`} />
        </button>

        <button
          type="button"
          className="ab-btn ab-btn--big"
          onClick={onToggleDensity}
          title={`Taille : ${DENSITY_LABELS[density]}`}
          aria-label={`BIG — taille d'affichage : ${DENSITY_LABELS[density]}`}
        >
          <span>BIG</span>
          <span className="ab-density" aria-hidden="true">
            {DENSITY_ORDER.map((step, index) => (
              <span
                key={step}
                className={`ab-density__bar${index <= activeIndex ? ' ab-density__bar--on' : ''}`}
              />
            ))}
          </span>
        </button>

        <button
          type="button"
          className="ab-btn ab-actions__hide-sm"
          onClick={onOpenApiKeys}
          title="Clés d'API (Mistral BYOK / clé managée)"
        >
          <IconKey width={14} height={14} />
          <span>Clé API : {statusLabel[apiKeyState]}</span>
          <span className={`ab-status ab-status--${apiKeyState}`} />
        </button>

        <button
          type="button"
          className="ab-btn ab-btn--ghost ab-actions__hide-sm"
          onClick={onToggleFullscreen}
          title={
            isImmersion
              ? 'Mode immersion : les barres sont masquées'
              : isFullscreen
                ? 'Quitter le plein écran'
                : 'Plein écran'
          }
        >
          {isFullscreen ? <IconMinimize width={14} height={14} /> : <IconMaximize width={14} height={14} />}
          <span>{isFullscreen ? 'Quitter' : 'Plein Écran'}</span>
        </button>

        <button
          type="button"
          className={`ab-btn ab-theme--${theme}`}
          onClick={onToggleTheme}
          title={
            theme === 'jour'
              ? 'Affichage en mode jour — passer en mode nuit'
              : 'Affichage en mode nuit — passer en mode jour'
          }
        >
          {theme === 'jour' ? <IconSun width={14} height={14} /> : <IconMoon width={14} height={14} />}
          <span className="ab-btn__texte-large">{theme === 'jour' ? 'Jour' : 'Nuit'}</span>
          <IconDot width={7} height={7} />
        </button>
      </div>
    </div>
  );
}
