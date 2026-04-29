import { useState } from 'react';
import { Link } from 'react-router-dom';

const ROLE_LABELS = {
  admin: 'Administrateur système',
  directeur: 'Directeur général (CEO)',
  responsable_stock: 'Responsable de stock',
  comptable: 'Comptable / Finance',
  vendeur: 'Commercial / Vendeur',
};

const ROLE_AUTO_MODULES = {
  admin:             ['stock','pred','report','alert','api','mobile'],
  directeur:     ['stock','pred','report','alert'],
  responsable_stock: ['stock','alert'],
  comptable:         ['report'],
  vendeur:           ['stock','report'],
};

const MODULES = [
  { key:'stock',  label:'📦 Gestion des stocks',       desc:'Mouvements, alertes, inventaires' },
  { key:'pred',   label:'🔮 Prédiction des commandes',  desc:'IA prédictive, réapprovisionnements' },
  { key:'report', label:'📊 Rapports & analyses',       desc:'KPIs, exports Excel/PDF' },
  { key:'alert',  label:'🔔 Alertes automatiques',      desc:'Seuils critiques, ruptures' },
  { key:'api',    label:'🔗 Intégrations API',          desc:'ERP, comptabilité, e-commerce' },
  { key:'mobile', label:'📱 Application mobile',        desc:'iOS & Android, codes-barres' },
];

function getPasswordScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 16) s = 5;
  return Math.min(s, 5);
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 fields
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret]             = useState('');
  const [legalForm, setLegalForm]     = useState('');
  const [sector, setSector]           = useState('');
  const [companySize, setCompanySize] = useState('');
  const [city, setCity]               = useState('');
  const [address, setAddress]         = useState('');
  const [country, setCountry]         = useState('');
  const [zip, setZip]                 = useState('');
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [jobTitle, setJobTitle]       = useState('');
  const [phoneCode, setPhoneCode]     = useState('+216');
  const [phone, setPhone]             = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [autoModules, setAutoModules]         = useState([]);

  // Step 2 fields
  const [loginEmail, setLoginEmail]   = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [showCpw, setShowCpw]         = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  const pwScore = getPasswordScore(password);
  const scoreColors = ['','#dc2626','#d97706','#d97706','#16a34a','#16a34a'];
  const scoreLabels = ['','Très faible','Faible','Moyen','Fort','Très fort'];

  const handleRoleChange = (role) => {
    setJobTitle(role);
    const auto = ROLE_AUTO_MODULES[role] || [];
    setAutoModules(auto);
    setSelectedModules(auto);
  };
  const validateStep1 = () => {
    const e = {};
    if (!companyName.trim()) e.companyName = '⚠ Champ obligatoire';
    if (!siret.trim()) e.siret = '⚠ Champ obligatoire';
    if (!legalForm) e.legalForm = '⚠ Champ obligatoire';
    if (!sector) e.sector = '⚠ Champ obligatoire';
    if (!city.trim()) e.city = '⚠ Champ obligatoire';
    if (!address.trim()) e.address = '⚠ Champ obligatoire';
    if (!country) e.country = '⚠ Champ obligatoire';
    if (!firstName.trim()) e.firstName = '⚠ Champ obligatoire';
    if (!lastName.trim()) e.lastName = '⚠ Champ obligatoire';
    if (!jobTitle) e.jobTitle = '⚠ Champ obligatoire';
    if (!phone.trim()) e.phone = '⚠ Champ obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e = {};
    const emailOk = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(loginEmail);
    if (!loginEmail) e.loginEmail = '⚠ Champ obligatoire';
    else if (!emailOk) e.loginEmail = '✉ Email invalide';
    if (!password) e.password = '⚠ Champ obligatoire';
    else if (pwScore < 2) e.password = '⚠ Mot de passe trop faible';
    if (!confirmPw) e.confirmPw = '⚠ Champ obligatoire';
    else if (password !== confirmPw) e.confirmPw = '⚠ Les mots de passe ne correspondent pas';
    if (!termsAccepted) e.terms = '⚠ Vous devez accepter les conditions pour continuer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };
  const handleSubmit = async () => {
    try {
      // 1. On crée un objet FormData (obligatoire pour correspondre à Form(...) en Python)
      const formData = new FormData();
      formData.append('nom', `${firstName} ${lastName}`);
      formData.append('email', loginEmail);
      formData.append('mot_de_passe', password);
      formData.append('role', jobTitle);
      formData.append('entreprise', companyName);
      formData.append('telephone', `${phoneCode} ${phone}`);

      // 2. On envoie la requête au port 8000
      const response = await fetch('http://localhost:8000/inscription', {
        method: 'POST',
        body: formData, // On envoie le FormData directement (ne pas mettre de Headers Content-Type)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Compte créé avec succès !');
        // 3. On utilise window.location.href pour forcer la redirection vers le login de React
        window.location.href = '/login?inscription=ok';
      } else {
        // Affiche l'erreur venant de Python (ex: "Cet email est déjà utilisé")
        alert(`❌ ${data.detail || "Erreur lors de l'inscription"}`);
      }
      } catch (error) {
          console.error("Erreur serveur:", error);
          // Utilise des guillemets doubles "" pour éviter le problème avec l'apostrophe de "qu'il"
          alert("❌ Le serveur Python ne répond pas. Vérifiez qu'il est lancé sur le port 8000."); 
      }
  };
  const F = (id) => ({ className: errors[id] ? 'error' : '' });
  return (
    <div className="register-page">
      <div className="page-wrapper">
        {/* HEADER */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">📦</div>
            <span className="logo-name">OptiStock</span>
          </div>
          <div className="intro-block">
            <h2>Rejoignez <span>OptiStock</span> pour simplifier vos processus et avancer vers votre <span>performance</span>.</h2>
            <p>Merci d'avoir choisi OptiStock. Remplissez le formulaire ci-dessous pour créer votre compte.</p>
          </div>
          <h1>Créer votre <span>compte entreprise</span></h1>
          <p className="sub">Optimisez vos stocks et anticipez vos commandes en toute simplicité.</p>
        </div>

        {/* STEPS BAR */}
        <div className="steps">
          {[{n:1,label:'Entreprise'},{n:2,label:'Accès'},{n:3,label:'Récapitulatif'}].map((s, i) => (
            <div key={s.n} style={{display:'flex',alignItems:'center',flex: i < 2 ? '1' : 'none'}}>
              <div className={`step ${step === s.n ? 'active' : step > s.n ? 'done' : ''}`}>
                <div className="step-dot">{step > s.n ? '✓' : s.n}</div>
                <div className="step-label">{s.label}</div>
              </div>
              {i < 2 && <div className={`step-line ${step > s.n ? 'done' : ''}`}></div>}
            </div>
          ))}
        </div>

        {/* CARD */}
        <div className="card">

          {/* ── ÉTAPE 1 ── */}
          {step === 1 && (
            <div className="section active">
              <div className="section-title"><div className="icon">🏢</div> Entreprise &amp; Utilisateur</div>
              <div className="section-desc">Informations de votre entreprise et du responsable du compte.</div>

              <div className="subsection-label">🏢 Informations de l'entreprise</div>
              <div className="grid-2">
                <div className="form-group col-span-2">
                  <label>Nom de l'entreprise <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">🏷</span>
                    <input type="text" placeholder="Ex : SARL OptiCom" value={companyName}
                      onChange={e => setCompanyName(e.target.value)} {...F('companyName')} />
                  </div>
                  {errors.companyName && <span className="field-msg error">{errors.companyName}</span>}
                </div>
                <div className="form-group">
                  <label>Numéro SIRET / RC <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">🔢</span>
                    <input type="text" placeholder="Ex: 80212345600019" value={siret} maxLength={20}
                      onChange={e => setSiret(e.target.value)} {...F('siret')} />
                  </div>
                  {errors.siret && <span className="field-msg error">{errors.siret}</span>}
                </div>
                <div className="form-group">
                  <label>Forme juridique <span className="req">*</span></label>
                  <select value={legalForm} onChange={e => setLegalForm(e.target.value)} {...F('legalForm')}>
                    <option value="">— Sélectionner —</option>
                    {['SARL','SAS / SASU','SA','EI / EIRL','SNC','Association','Autre'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  {errors.legalForm && <span className="field-msg error">{errors.legalForm}</span>}
                </div>
                <div className="form-group">
                  <label>Secteur d'activité <span className="req">*</span></label>
                  <select value={sector} onChange={e => setSector(e.target.value)} {...F('sector')}>
                    <option value="">— Choisir —</option>
                    {['Commerce de détail','Commerce de gros','Autre'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  {errors.sector && <span className="field-msg error">{errors.sector}</span>}
                </div>
                <div className="form-group">
                  <label>Taille de l'entreprise <span className="badge">Optionnel</span></label>
                  <select value={companySize} onChange={e => setCompanySize(e.target.value)}>
                    <option value="">— Optionnel —</option>
                    {['1–10 employés','11–50 employés','51–200 employés','201–500 employés','500+ employés'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ville <span className="req">*</span></label>
                  <input type="text" placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} {...F('city')} />
                  {errors.city && <span className="field-msg error">{errors.city}</span>}
                </div>
                <div className="form-group col-span-2">
                  <label>Adresse <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">📍</span>
                    <input type="text" placeholder="N°, Rue, Avenue..." value={address}
                      onChange={e => setAddress(e.target.value)} {...F('address')} />
                  </div>
                  {errors.address && <span className="field-msg error">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label>Pays <span className="req">*</span></label>
                  <select value={country} onChange={e => setCountry(e.target.value)} {...F('country')}>
                    <option value="">— Sélectionner —</option>
                    {['Tunisie','France','Algérie','Maroc','Belgique','Suisse','Canada','Sénégal','Autre'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  {errors.country && <span className="field-msg error">{errors.country}</span>}
                </div>
                <div className="form-group">
                  <label>Code postal <span className="badge">Optionnel</span></label>
                  <input type="text" placeholder="Ex : 1000" value={zip} maxLength={10} onChange={e => setZip(e.target.value)} />
                </div>
              </div>

              <div className="subsection-label">👤 Responsable du compte</div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Prénom <span className="req">*</span></label>
                  <input type="text" placeholder="Prénom" value={firstName}
                    onChange={e => setFirstName(e.target.value)} {...F('firstName')} />
                  {errors.firstName && <span className="field-msg error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Nom <span className="req">*</span></label>
                  <input type="text" placeholder="Nom de famille" value={lastName}
                    onChange={e => setLastName(e.target.value)} {...F('lastName')} />
                  {errors.lastName && <span className="field-msg error">{errors.lastName}</span>}
                </div>
                <div className="form-group">
                  <label>Rôle / Poste <span className="req">*</span></label>
                  <select value={jobTitle} onChange={e => handleRoleChange(e.target.value)} {...F('jobTitle')}>
                    <option value="">— Sélectionner —</option>
                    {Object.entries(ROLE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  {errors.jobTitle && <span className="field-msg error">{errors.jobTitle}</span>}
                </div>
                <div className="form-group">
                  <label>Téléphone <span className="req">*</span></label>
                  <div className="phone-group">
                    <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={{width:'120px',flexShrink:0}}>
                      <option value="+216">🇹🇳 +216</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+213">🇩🇿 +213</option>
                      <option value="+212">🇲🇦 +212</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+1">🇨🇦 +1</option>
                    </select>
                    <div className="input-wrap" style={{flex:1}}>
                      <span className="i-icon">📞</span>
                      <input type="tel" placeholder="Ex : 71 234 567" value={phone}
                        onChange={e => setPhone(e.target.value)} {...F('phone')} />
                    </div>
                  </div>
                  {errors.phone && <span className="field-msg error">{errors.phone}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 ── */}
          {step === 2 && (
            <div className="section active">
              <div className="section-title"><div className="icon">🔐</div> Accès au compte</div>
              <div className="section-desc">Définissez vos identifiants de connexion sécurisés.</div>
              <div className="grid-2">
                <div className="form-group col-span-2">
                  <label>Email de connexion <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">✉️</span>
                    <input type="email" placeholder="votre@email.com" value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)} {...F('loginEmail')} />
                  </div>
                  {errors.loginEmail && <span className="field-msg error">{errors.loginEmail}</span>}
                </div>
                <div className="form-group col-span-2">
                  <label>Mot de passe <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">🔒</span>
                    <input type={showPw ? 'text' : 'password'} placeholder="Créer un mot de passe sécurisé"
                      value={password} onChange={e => setPassword(e.target.value)}
                      style={{paddingRight:'42px'}} {...F('password')} />
                    <span className="i-suffix" onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁'}</span>
                  </div>
                  {password && (
                    <div className="pw-strength show">
                      <div className="pw-bars">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="pw-bar"
                            style={{background: i <= Math.min(pwScore,4) ? scoreColors[pwScore] : '#d4dde8'}}></div>
                        ))}
                      </div>
                      <div className="pw-label">Force : <span style={{color: scoreColors[pwScore]}}>{scoreLabels[pwScore] || '—'}</span></div>
                      <div className="pw-reqs">
                        {[
                          ['req-len',   password.length >= 8,     '8 caractères minimum'],
                          ['req-upper', /[A-Z]/.test(password),   'Une majuscule'],
                          ['req-lower', /[a-z]/.test(password),   'Une minuscule'],
                          ['req-num',   /[0-9]/.test(password),   'Un chiffre'],
                          ['req-spec',  /[^A-Za-z0-9]/.test(password), 'Un caractère spécial'],
                          ['req-16',    password.length >= 16,    '16 car. (très fort)'],
                        ].map(([id, met, label]) => (
                          <div key={id} className={`req-item ${met ? 'met' : ''}`}>
                            <span className="dot"></span> {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <span className="field-msg error">{errors.password}</span>}
                </div>
                <div className="form-group col-span-2">
                  <label>Confirmer le mot de passe <span className="req">*</span></label>
                  <div className="input-wrap"><span className="i-icon">🔒</span>
                    <input type={showCpw ? 'text' : 'password'} placeholder="Retaper le même mot de passe"
                      value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      style={{paddingRight:'42px'}} {...F('confirmPw')} />
                    <span className="i-suffix" onClick={() => setShowCpw(!showCpw)}>{showCpw ? '🙈' : '👁'}</span>
                  </div>
                  {confirmPw && password === confirmPw && (
                    <span className="field-msg success">✓ Les mots de passe correspondent.</span>
                  )}
                  {errors.confirmPw && <span className="field-msg error">{errors.confirmPw}</span>}
                </div>
              </div>
              <hr className="divider" />
              <div className={`terms-wrap ${termsAccepted ? 'checked' : ''}`} onClick={() => setTermsAccepted(!termsAccepted)}>
                <div className="terms-box">{termsAccepted ? '✓' : ''}</div>
                <span className="terms-text">
                  J'accepte les <a href="#" onClick={e => e.stopPropagation()}>Conditions Générales d'Utilisation</a> et la{' '}
                  <a href="#" onClick={e => e.stopPropagation()}>Politique de Confidentialité</a> d'OptiStock.{' '}
                  Je confirme être autorisé(e) à inscrire mon entreprise. <span style={{color:'var(--error)'}}>*</span>
                </span>
              </div>
              {errors.terms && <span className="field-msg error" style={{marginTop:'8px',display:'flex'}}>{errors.terms}</span>}
            </div>
          )}
          {/* ── ÉTAPE 3 — RÉCAPITULATIF (DROITS IMPOSÉS) ── */}
          {step === 3 && (
            <div className="section active">
              <div className="section-title"><div className="icon">📋</div> Confirmation des accès</div>
              <div className="section-desc">Vérifiez vos informations. Vos accès ont été configurés automatiquement selon votre rôle.</div>

              <div className="recap-card">
                <div className="recap-card-header"><div className="rc-icon">🏢</div><h3>Entreprise</h3></div>
                <div className="recap-grid-2">
                  <div className="recap-field"><div className="recap-label">Nom</div><div className="recap-value">{companyName}</div></div>
                  <div className="recap-field"><div className="recap-label">Rôle</div><div className="recap-value"><span className="role-pill">🎯 {ROLE_LABELS[jobTitle]}</span></div></div>
                </div>
              </div>

              {/* ICI : On affiche les modules imposés par le rôle sélectionné au début */}
              <div className="recap-card" style={{ marginTop: '15px', borderTop: '3px solid #023ab3' }}>
                <div className="recap-card-header"><div className="rc-icon">⚙️</div><h3>Permissions de votre compte</h3></div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                    En tant que <strong>{ROLE_LABELS[jobTitle]}</strong>, les modules suivants sont activés pour vous :
                  </p>
                  <div className="modules-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ROLE_AUTO_MODULES[jobTitle]?.map(mKey => {
                      const mInfo = MODULES.find(x => x.key === mKey);
                      return (
                        <span key={mKey} className="module-pill" style={{ backgroundColor: '#e0e7ff', color: '#023ab3', border: '1px solid #c7d2fe' }}>
                          {mInfo ? mInfo.label : mKey}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER NAVIGATION */}
          <div className="card-footer-nav">
            <button className="btn btn-ghost" style={{visibility: step === 1 ? 'hidden' : 'visible'}}
              onClick={() => setStep(s => s - 1)}>
              ← Retour
            </button>
            <span style={{fontSize:'12px',color:'var(--text-muted)',fontWeight:'500'}}>Étape {step} sur 3</span>
            {step < 3
              ? <button className="btn btn-primary" onClick={handleNext}>Suivant →</button>
              : <button className="btn btn-submit" onClick={handleSubmit}>✅ Créer mon compte</button>
            }
          </div>
        </div>

        <div className="register-footer-link">
          Déjà un compte ? <Link to="/login">Se connecter →</Link>
        </div>
      </div>
    </div>
  );
}