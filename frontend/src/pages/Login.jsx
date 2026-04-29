import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [remember, setRemember]   = useState(false);
  const [emailErr, setEmailErr]   = useState('');
  const [pwErr, setPwErr]         = useState('');
  const [alertMsg, setAlertMsg]   = useState('');
  const [shake, setShake]         = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('erreur') === '1') {
      setAlertMsg('Email ou mot de passe incorrect. Veuillez réessayer.');
    } else if (params.get('inscription') === 'ok') {
      setBannerMsg('✅ Compte créé avec succès ! Connectez-vous avec vos identifiants.');
    }
  }, [location.search]);

  const validateEmail = (val) => {
    if (!val) return false;
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    // Validation de base
    if (!email) {
      setEmailErr('⚠ Ce champ est obligatoire.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailErr('✉ Adresse email invalide.');
      valid = false;
    } else {
      setEmailErr('');
    }

    if (!password) {
      setPwErr('⚠ Ce champ est obligatoire.');
      valid = false;
    } else {
      setPwErr('');
    }

    if (!valid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // --- ENVOI AU BACKEND (Port 8000) ---
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('mot_de_passe', password);

const response = await fetch('http://localhost:8000/connexion', {
  method: 'POST',
  body: formData,
});

if (response.ok) {
  // 1. EXTRAIRE les données JSON envoyées par Python
  const resData = await response.json();    
   localStorage.setItem('userEntreprise', resData.entreprise); 
    localStorage.setItem('userRole', resData.role);
    navigate('/dashboard');

  
  // 2. Vérifier dans la console ce qu'on reçoit (F12 pour voir)
  console.log("Données reçues du serveur:", resData);

  // 3. STOCKER avec les bons noms de clés
  localStorage.setItem('userRole', resData.role);
  localStorage.setItem('userEntreprise', resData.entreprise);
  localStorage.setItem('userEmail', resData.user_email);

  // 4. Rediriger
  navigate('/dashboard');
} else {
        // Si Python renvoie une erreur (401), on affiche l'alerte
        setAlertMsg('Email ou mot de passe incorrect. Veuillez réessayer.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      setAlertMsg('❌ Le serveur Python ne répond pas (Port 8000).');
    }
  };

  return (
    <div className="login-page">
      <div className="page-wrapper">
        {/* HEADER */}
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">📦</div>
            <span className="logo-name">OptiStock</span>
          </div>
          <h1>Bon retour <span>parmi nous</span></h1>
          <p className="sub">Connectez-vous pour accéder à votre tableau de bord.</p>
        </div>

        {/* CARD */}
        <div className={`card ${shake ? 'shake' : ''}`} id="loginCard">
          <div className="card-body">
            {/* Banner success */}
            <div className="welcome-banner">
              <p>
                {bannerMsg || (
                  <>Gérez vos <strong>stocks</strong> et anticipez vos <strong>commandes</strong> en temps réel.
                  Entrez vos identifiants pour continuer.</>
                )}
              </p>
            </div>

            {/* Alert error */}
            {alertMsg && (
              <div className="alert-error show">
                <span className="alert-icon">⚠️</span>
                <span>{alertMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-group">
                <label>Email <span className="req">*</span></label>
                <div className="input-wrap">
                  <span className="i-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setAlertMsg(''); }}
                    className={emailErr ? 'error' : ''}
                    autoComplete="email"
                  />
                </div>
                {emailErr && <span className="field-msg error">{emailErr}</span>}
              </div>

              {/* Mot de passe */}
              <div className="form-group">
                <label>Mot de passe <span className="req">*</span></label>
                <div className="input-wrap">
                  <span className="i-icon">🔒</span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setAlertMsg(''); }}
                    className={pwErr ? 'error' : ''}
                    autoComplete="current-password"
                    style={{ paddingRight: '42px' }}
                  />
                  <span className="i-suffix" onClick={() => setShowPw(!showPw)}>
                    {showPw ? '🙈' : '👁'}
                  </span>
                </div>
                {pwErr && <span className="field-msg error">{pwErr}</span>}
              </div>

              {/* Options */}
              <div className="options-row">
                <label
                  className={`remember-me ${remember ? 'checked' : ''}`}
                  onClick={() => setRemember(!remember)}
                  style={{ cursor: 'pointer' }}
                >
                  <input type="checkbox" checked={remember} onChange={() => {}} style={{ display: 'none' }} />
                  <div className="custom-check">{remember ? '✓' : ''}</div>
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="forgot-link">Mot de passe oublié ?</a>
              </div>

              <button type="submit" className="btn-submit">
                🔓 Se connecter
              </button>
            </form>
          </div>

          <div className="card-footer">
            Pas encore de compte ?{' '}
            <Link to="/register">Créer un compte entreprise →</Link>
          </div>
        </div>

        {/* Security badges */}
        <div className="security-row">
          <div className="sec-badge"><span>🔒</span> Connexion chiffrée SSL</div>
          <div className="sec-badge"><span>🛡</span> Données sécurisées</div>
          <div className="sec-badge"><span>✅</span> RGPD conforme</div>
        </div>
      </div>
    </div>
  );
}