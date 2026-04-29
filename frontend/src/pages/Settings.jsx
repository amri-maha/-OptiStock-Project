import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Building, Lock, Bell, 
  Save, ShieldCheck, Mail, Smartphone, Eye, EyeOff,
  Briefcase, Globe, MapPin, CheckCircle
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil'); // Onglet par défaut

  // --- RÉCUPÉRATION DES DONNÉES LOCALES ---
  const entreprise = localStorage.getItem('userEntreprise') || "Agro SARL";
  const email = localStorage.getItem('userEmail') || "admin@agro.tn";
  const role = localStorage.getItem('userRole') || "admin";

  // --- ÉTATS INTERNES ---
  const [showPw, setShowPw] = useState(false);
  const [notifs, setNotifs] = useState({ stock: true, ia: true, import: false });

  const handleSave = () => {
    alert("✅ Tous vos paramètres ont été mis à jour avec succès !");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Barlow, sans-serif' }}>
      
      {/* BARRE DE NAVIGATION HAUTE */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '15px 40px', display: 'flex', alignItems: 'center', gap: '20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Gestion du Profil & Réglages</h1>
      </div>

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
          
          {/* --- SIDEBAR DE NAVIGATION --- */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('profil')} className={`nav-tab ${activeTab === 'profil' ? 'active' : ''}`}>
              <User size={18} /> Mon Profil Personnel
            </button>
            <button onClick={() => setActiveTab('entreprise')} className={`nav-tab ${activeTab === 'entreprise' ? 'active' : ''}`}>
              <Building size={18} /> Informations Entreprise
            </button>
            <button onClick={() => setActiveTab('securite')} className={`nav-tab ${activeTab === 'securite' ? 'active' : ''}`}>
              <Lock size={18} /> Sécurité & Mot de passe
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}>
              <Bell size={18} /> Centre de Notifications
            </button>
          </aside>

          {/* --- ZONE DE CONTENU PRINCIPALE --- */}
          <main style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            
            {/* 1. SECTION PROFIL */}
            {activeTab === 'profil' && (
              <div className="fade-in">
                <h2 className="section-title"><User color="#023ab3" /> Profil de l'utilisateur</h2>
                <p className="section-desc">Mettez à jour vos informations personnelles pour votre compte OptiStock.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                  <div className="input-group">
                    <label>Prénom</label>
                    <input type="text" defaultValue="Maha" />
                  </div>
                  <div className="input-group">
                    <label>Nom</label>
                    <input type="text" defaultValue="Amri" />
                  </div>
                  <div className="input-group">
                    <label>Poste occupé</label>
                    <div className="role-badge"><Briefcase size={14} /> {role.toUpperCase()}</div>
                  </div>
                  <div className="input-group">
                    <label>Langue préférée</label>
                    <select><option>Français (FR)</option><option>English (EN)</option></select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTION ENTREPRISE */}
            {activeTab === 'entreprise' && (
              <div className="fade-in">
                <h2 className="section-title"><Building color="#023ab3" /> Fiche Entreprise</h2>
                <p className="section-desc">Ces informations apparaissent sur vos rapports et documents officiels.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Nom de la structure</label>
                    <input type="text" defaultValue={entreprise} disabled />
                  </div>
                  <div className="input-group">
                    <label>Identifiant Fiscal / RC</label>
                    <input type="text" defaultValue="802145789-TN" />
                  </div>
                  <div className="input-group">
                    <label>Secteur</label>
                    <input type="text" defaultValue="Agroalimentaire" />
                  </div>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Adresse du Siège</label>
                    <div style={{ position: 'relative' }}>
                       <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                       <input type="text" style={{ paddingLeft: '40px' }} defaultValue="Zone Industrielle, Tunis, Tunisie" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SECTION SÉCURITÉ */}
            {activeTab === 'securite' && (
              <div className="fade-in">
                <h2 className="section-title"><ShieldCheck color="#10b981" /> Sécurité du compte</h2>
                <p className="section-desc">Gérez votre email et la robustesse de votre accès.</p>
                
                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div className="input-group">
                    <label>Adresse Email (Identifiant)</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                      <input type="email" style={{ paddingLeft: '40px' }} defaultValue={email} disabled />
                    </div>
                  </div>

                  <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '15px' }}>Modifier votre mot de passe</h4>
                    <div className="input-group">
                      <label>Ancien mot de passe</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <label>Nouveau mot de passe</label>
                      <input type={showPw ? "text" : "password"} placeholder="8 caractères min." />
                      <button onClick={() => setShowPw(!showPw)} className="btn-show-pw">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECTION NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="fade-in">
                <h2 className="section-title"><Bell color="#f59e0b" /> Centre de Notifications</h2>
                <p className="section-desc">Contrôlez les alertes envoyées par le système IA.</p>
                
                <div style={{ marginTop: '30px' }}>
                  <div className="notif-card">
                    <div className="notif-toggle">
                      <div className="notif-info">
                        <strong>Alertes de stock critique</strong>
                        <p>Être prévenu par email dès qu'un produit atteint le seuil de rupture.</p>
                      </div>
                      <input type="checkbox" checked={notifs.stock} onChange={() => setNotifs({...notifs, stock: !notifs.stock})} />
                    </div>
                  </div>

                  <div className="notif-card">
                    <div className="notif-toggle">
                      <div className="notif-info">
                        <strong>Rapports de performance hebdomadaires</strong>
                        <p>Recevoir le lundi matin un résumé des ventes et des analyses IA.</p>
                      </div>
                      <input type="checkbox" checked={notifs.ia} onChange={() => setNotifs({...notifs, ia: !notifs.ia})} />
                    </div>
                  </div>

                  <div className="notif-card">
                    <div className="notif-toggle">
                      <div className="notif-info">
                        <strong>Sécurité & Connexions</strong>
                        <p>Être averti en cas de connexion sur un nouvel appareil.</p>
                      </div>
                      <input type="checkbox" checked={notifs.import} onChange={() => setNotifs({...notifs, import: !notifs.import})} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOUTON DE SAUVEGARDE UNIFIÉ */}
            <div style={{ marginTop: '50px', paddingTop: '25px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} className="btn-save">
                <Save size={18} /> Enregistrer tous les changements
              </button>
            </div>

          </main>
        </div>
      </div>

      <style>{`
        .btn-back { background: white; border: 1px solid #e2e8f0; padding: 10px; borderRadius: 12px; cursor: pointer; color: #64748b; transition: 0.2s; display: flex; }
        .btn-back:hover { background: #f1f5f9; color: #023ab3; transform: translateX(-3px); }
        
        .nav-tab { background: transparent; border: none; padding: 14px 20px; borderRadius: 12px; display: flex; alignItems: center; gap: 12px; cursor: pointer; color: #64748b; fontWeight: 600; fontSize: 14px; transition: 0.2s; textAlign: left; width: 100%; }
        .nav-tab:hover { background: #eef2ff; color: #023ab3; }
        .nav-tab.active { background: #023ab3; color: white; boxShadow: 0 10px 15px -3px rgba(2, 58, 179, 0.2); }
        
        .section-title { font-size: 22px; fontWeight: 800; color: #0f172a; margin: 0; display: flex; alignItems: center; gap: 12px; }
        .section-desc { font-size: 14px; color: #64748b; margin: 8px 0 0 0; }
        
        .input-group { display: flex; flexDirection: column; gap: 8px; marginBottom: 15px; }
        .input-group label { font-size: 11px; fontWeight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-group input, .input-group select { padding: 12px 15px; borderRadius: 10px; border: 1.5px solid #e2e8f0; background: #fcfcfd; outline: none; transition: 0.2s; fontSize: 14px; color: #1e293b; }
        .input-group input:focus { border-color: #023ab3; background: white; box-shadow: 0 0 0 4px rgba(2, 58, 179, 0.05); }
        .input-group input:disabled { background: #f1f5f9; cursor: not-allowed; color: #94a3b8; }
        
        .role-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; background: #f0f7ff; color: #023ab3; borderRadius: 10px; fontWeight: 800; fontSize: 13px; border: 1px solid #bfdbfe; width: fit-content; }
        
        .notif-card { padding: 20px; borderRadius: 15px; border: 1px solid #f1f5f9; marginBottom: 15px; transition: 0.2s; }
        .notif-card:hover { border-color: #023ab3; background: #f8faff; }
        .notif-toggle { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .notif-info strong { display: block; font-size: 14px; color: #0f172a; }
        .notif-info p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; }
        
        .btn-save { background: #023ab3; color: white; border: none; padding: 14px 30px; borderRadius: 12px; fontWeight: 700; cursor: pointer; display: flex; alignItems: center; gap: 10px; transition: 0.3s; }
        .btn-save:hover { background: #103183; transform: translateY(-2px); boxShadow: 0 12px 20px -5px rgba(2, 58, 179, 0.3); }
        .btn-show-pw { position: absolute; right: 12px; top: 32px; background: none; border: none; color: #94a3b8; cursor: pointer; }

        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}