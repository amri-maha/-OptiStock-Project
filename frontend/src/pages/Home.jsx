import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="hero-badge">Nouveau — v1.0</span>
          <h1>Opti<br /><span>Stock</span></h1>
          <p>
            <strong>Moins de pertes, moins d'effort !!</strong><br />
            Optimisez votre gestion de stock en toute simplicité.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="btn-primary">
              Rejoignez-nous
            </button>
            <button onClick={() => navigate('/login')} className="btn-outline">
              Se Connecter
            </button>
          </div>
        </div>
        <div className="wave-bottom">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,45 C180,90 360,0 540,40 C720,80 900,10 1080,45 C1200,68 1350,20 1440,45 L1440,90 L0,90 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* INTRO */}
      <section className="intro">
        <h2>Gérez moins ! Maîtrisez plus ! Décidez avec confiance ✅</h2>
        <h2>Une gestion de stocks <span>performante</span> et <span>fiable</span> pour votre entreprise</h2>
        <p>
          OptiStock, une application qui accompagne votre équipe au quotidien dans la gestion des stocks de votre
          entreprise et vous aide à <strong>rompre avec les ruptures imprévues, les surstocks coûteux et les décisions
          prises à l'aveugle.</strong>
          <br />
          Grâce à l'analyse des données historiques, notre solution permet d'anticiper vos besoins et ajuster
          automatiquement vos commandes. Elle vous alerte également en temps réel dès qu'un produit atteint un seuil
          critique — avant même que le problème ne survienne. Des tableaux de bord visuels et intuitifs vous offrent
          une vue complète de votre activité en un coup d'œil, où que vous soyez et depuis n'importe quel appareil.
          <br />
          <strong>
            Notre rôle est clair : transformer vos données brutes en décisions intelligentes et mesurables. Parce que
            votre performance n'est pas juste un objectif, c'est notre engagement. Concentrez-vous sur votre cœur de
            métier, OptiStock s'occupe de tout.
          </strong>
        </p>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-header">
          <h2>Tout ce dont vous avez <span>besoin</span></h2>
          <p>Nos outils puissants pour une gestion de stocks intelligente</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            </div>
            <h3>Visualisation & Interprétation</h3>
            <p>Suivez vos stocks en temps réel depuis un tableau de bord clair et intuitif. Comprenez vos tendances, anticipez vos besoins et générez vos demandes d'achat en un clic.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </div>
            <h3>Gestion facile de stock</h3>
            <p>Modifiez et actualisez vos stocks en quelques clics, à tout moment et depuis n'importe quel appareil, pour un suivi toujours précis et à jour.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            </div>
            <h3>Optimisez la gestion de vos stocks</h3>
            <p>Ni surstock, ni rupture. OptiStock analyse vos données et ajuste automatiquement vos commandes en anticipant les périodes de forte ou faible demande.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <h3>Alertes de rupture</h3>
            <p>Ne soyez plus jamais pris au dépourvu. OptiStock vous alerte instantanément dès qu'un seuil critique est atteint, pour agir avant que le problème ne survienne.</p>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="showcase-section">
        <div className="showcase-content">
          <div className="showcase-section-title">
            <div className="intro"><h2>Une équipe d'experts à votre <span>service</span></h2></div>
          </div>
          <div className="showcase-text">
            <h2>1-Pilotez vos stocks en <span>temps réel</span></h2>
            <ul className="showcase-features">
              <li><span className="check">✓</span> Tableaux de bord visuels et intuitifs</li>
              <li><span className="check">✓</span> Gestion et mise à jour en temps réel</li>
            </ul>
          </div>
          <div className="showcase-text">
            <h2>2-Anticipez grâce à la <span>prévision intelligente</span></h2>
            <ul className="showcase-features">
              <li><span className="check">✓</span> Prévision intelligente de la demande</li>
              <li><span className="check">✓</span> Analyse des ventes et du stock</li>
            </ul>
          </div>
          <div className="showcase-text">
            <h2>3-Zéro rupture, <span>zéro surstock</span></h2>
            <ul className="showcase-features">
              <li><span className="check">✓</span> Équilibre parfait des niveaux de stock</li>
              <li><span className="check">✓</span> Réduction des coûts de stockage</li>
            </ul>
          </div>
        </div>
        <div className="showcase-img-wrap">
          <img
            src="https://img.etimg.com/thumb/width-1200,height-900,imgsize-58226,resizemode-75,msid-123567471/markets/stocks/news/ahead-of-market-10-things-that-will-decide-stock-market-action-on-friday.jpg"
            alt="Stock Management"
          />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-band">
        <div className="stat-item">
          <div className="stat-num">500+</div>
          <div className="stat-label">Entreprises clientes</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">99.9%</div>
          <div className="stat-label">Disponibilité</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">2M+</div>
          <div className="stat-label">Articles gérés</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">-40%</div>
          <div className="stat-label">Erreurs d'inventaire</div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <h2>Prêt à optimiser <span>votre gestion de stocks</span></h2>
        <p>
          Pas de solutions génériques, pas de compromis. Forts de notre expérience, nous analysons votre situation
          pour vous accompagner avec une approche vraiment adaptée.
        </p>
        <button className="btn-primary" onClick={() => navigate('/register')}>
          Voir Plus
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <div>© 2026 <span>OptiStock</span> — Smart Inventory Solution &nbsp;|&nbsp; Tous droits réservés.</div>
        <div>Contactez Nous : <p>+216 44 443 403</p></div>
      </footer>
    </>
  );
}