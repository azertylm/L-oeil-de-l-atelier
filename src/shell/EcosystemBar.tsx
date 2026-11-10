import type { AlphaAppConfig, AlphaSite } from './config';
import { IconStar } from './icons';
import type { ShellConfig } from './pricing';

interface EcosystemBarProps {
  app: AlphaAppConfig;
  sites: AlphaSite[];
  maxSites: number;
  hubUrl: string;
  config: ShellConfig;
  /** Compteur affiché (l'app le fournit, ou calculé par la base depuis le registre). */
  counter?: AlphaAppConfig['counter'];
  onOpenPayment: () => void;
  /** Ouvre le panneau « dons » de la base. */
  onOpenDon: () => void;
  /** Ouvre le panneau « applications de l'écosystème ». */
  onOpenSites: () => void;
}

const hosts = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

/**
 * Barre 1 — « écosystème ».
 * Logo alphabette.fr, dons, les 5 sites, compteur d'accès (cliquable : il ouvre
 * le registre des applications) et bouton Pass (résumé de l'offre + paiement).
 *
 * Clic fiable : la navigation reste dans le même onglet ; le site courant
 * n'est pas un lien (on y est déjà) ; une application « brouillon » ou sans
 * adresse affiche « bientôt en ligne » au lieu de mener à une page d'erreur.
 */
export function EcosystemBar({
  app,
  sites,
  maxSites,
  hubUrl,
  config,
  counter,
  onOpenPayment,
  onOpenDon,
  onOpenSites,
}: EcosystemBarProps) {
  const visibleSites = sites.slice(0, maxSites);

  return (
    <div className="ab-eco">
      <a className="ab-eco__brand" href={hubUrl} title="alphabette.fr — hub de l'écosystème">
        <span className="ab-eco__brand-mark">α</span>
        <span>ALPHABETTE</span>
      </a>

      <button type="button" className="ab-btn ab-btn--don" onClick={onOpenDon} title="Soutenir le projet">
        ♥ DON
      </button>

      <nav className="ab-eco__sites" aria-label="Autres sites de l'écosystème">
        {visibleSites.map((site) => {
          const courant = site.key === app.key;
          const horsLigne = Boolean(site.status && site.status !== 'actif');

          // Site courant : on y est déjà, ce n'est pas un lien.
          if (courant) {
            return (
              <span key={site.key} className="ab-site ab-site--active" aria-current="page" title={`${site.label} — vous êtes ici`}>
                {site.icon && <span aria-hidden="true">{site.icon}</span>}
                <span>{site.label}</span>
              </span>
            );
          }

          // Pas encore en ligne : indisponible plutôt qu'un lien d'erreur.
          if (!site.url || horsLigne) {
            return (
              <span key={site.key} className="ab-site ab-site--off" title={`${site.label} — bientôt en ligne`}>
                {site.icon && <span aria-hidden="true">{site.icon}</span>}
                <span>{site.label}</span>
              </span>
            );
          }

          return (
            <a
              key={site.key}
              className="ab-site"
              href={site.url}
              title={`${site.label} — ${hosts(site.url)}`}
            >
              {site.icon && <span aria-hidden="true">{site.icon}</span>}
              <span>{site.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="ab-eco__right">
        {counter && (
          <button
            type="button"
            className="ab-counter"
            onClick={onOpenSites}
            title={
              app.gratuit
                ? `${app.name} est gratuite. ${
                    typeof counter.gratuites === 'number'
                      ? `${counter.gratuites} des ${counter.total} applications de l'écosystème ${
                          counter.gratuites > 1 ? 'sont gratuites' : 'est gratuite'
                        }`
                      : `Aucun prix, aucun essai, aucune carte bancaire`
                  } — voir la liste.`
                : "Voir les applications de l'écosystème"
            }
          >
            <span>{app.gratuit ? 'gratuit' : `${counter.unlocked}/${counter.total}`}</span>
            {app.gratuit ? (
              typeof counter.gratuites === 'number' ? (
                <span className="ab-counter__trial">
                  ({counter.gratuites} sur {counter.total})
                </span>
              ) : null
            ) : (
              typeof counter.trialDaysLeft === 'number' &&
              counter.trialDaysLeft > 0 && (
                <span className="ab-counter__trial">({counter.trialDaysLeft} essai)</span>
              )
            )}
          </button>
        )}

        {app.gratuit ? (
          // Application gratuite : aucun prix affiché, mais la porte vers le hub
          // reste là — c'est l'écosystème qui finance l'application.
          <button
            type="button"
            className="ab-btn"
            onClick={onOpenPayment}
            title="Cette application est gratuite — découvrir l'écosystème alphabette.fr"
          >
            <span>🧭 L'écosystème</span>
          </button>
        ) : (
          <button
            type="button"
            className="ab-btn ab-btn--pass"
            onClick={onOpenPayment}
            title={`Écosystème complet : ${config.ecosystemPerYear} € / an — voir l'offre`}
          >
            <IconStar width={14} height={14} />
            <span>Pass {config.ecosystemPerYear} €/an</span>
          </button>
        )}
      </div>
    </div>
  );
}
