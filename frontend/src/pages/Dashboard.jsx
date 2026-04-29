import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, LayoutDashboard, TrendingUp, AlertTriangle, 
  Plus, Search, Trash2, LogOut, Settings, Download 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- A. CONFIGURATION DES DROITS PAR RÔLE ---
const ROLES_IA = ['admin', 'directeur', 'responsable_stock'];
const ROLES_STOCK = ['admin', 'directeur', 'responsable_stock', 'vendeur'];

export default function Dashboard() {
  const navigate = useNavigate();

  // --- B. RÉCUPÉRATION INFOS SESSION ---
  const role = localStorage.getItem('userRole');
  const entreprise = localStorage.getItem('userEntreprise');

  // --- C. ÉTATS (STATES) ---
  const [products, setProducts] = useState([]);
  const [smartAlerts, setSmartAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({ name: "", quantity: 0, min_threshold: 5, price: 0 });

  // --- D. CHARGEMENT DES DONNÉES ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/products?entreprise=${entreprise}`);
      setProducts(res.data);
    } catch (err) { console.error("Erreur de chargement des produits"); }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/smart-alerts?entreprise=${entreprise}&role=${role}`);
      setSmartAlerts(res.data);
    } catch (err) { console.log("Erreur lors du chargement des alertes IA"); }
  };

  useEffect(() => {
    if (entreprise) {
      fetchProducts();
      if (ROLES_IA.includes(role)) fetchAlerts();
    }
  }, [role, entreprise]);

  // --- E. ACTIONS ---
  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`http://localhost:8000/api/products/import?entreprise=${entreprise}`, formData);
      alert("✅ Importation réussie !");
      fetchProducts(); 
    } catch (error) { alert("❌ Erreur format CSV"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/products', { ...newProd, entreprise });
    setShowAddForm(false);
    setNewProd({ name: "", quantity: 0, min_threshold: 5, price: 0 });
    fetchProducts();
  };

  const handleSell = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/products/sell/${id}`);
      fetchProducts(); // Rafraîchit les stocks et les stats
    } catch (err) { alert("Stock insuffisant !"); }
  };

  const deleteProduct = async (id) => {
    if(window.confirm("Supprimer ce produit ?")) {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Barlow, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', backgroundColor: '#040c15', color: 'white', padding: '30px 20px', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
          <div style={{ backgroundColor: '#023ab3', padding: '8px', borderRadius: '10px' }}><Package size={24} /></div>
          <span style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Opti<span style={{ color: '#3368c4' }}>Stock</span></span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li className="nav-item active" onClick={() => navigate('/dashboard')}><LayoutDashboard size={20} /> Dashboard</li>
            {ROLES_IA.includes(role) && (
              <li className="nav-item" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
                <TrendingUp size={20} /> Analyses & Performance
              </li>
            )}
            <li className="nav-item" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
              <Settings size={20} /> Paramètres
            </li>
          </ul>
        </nav>

        <div onClick={() => { localStorage.clear(); navigate('/'); }} className="logout-btn" style={{ cursor: 'pointer', display: 'flex', gap: '10px', color: '#94a3b8', padding: '20px 0' }}>
          <LogOut size={20} /> Déconnexion
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800', margin: 0 }}>Gestion d'Inventaire</h1>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Structure : <span style={{ color: '#023ab3', fontWeight: '700' }}>{entreprise?.toUpperCase()}</span></p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {role === 'admin' && (
              <>
                <input type="file" id="csv-upload" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                <button onClick={() => document.getElementById('csv-upload').click()} className="btn-secondary">
                  <Download size={18} /> Importer CSV
                </button>
              </>
            )}
            {ROLES_STOCK.includes(role) && (
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                <Plus size={18} /> Nouveau Produit
              </button>
            )}
          </div>
        </header>

        {/* ALERTES IA (Conditionnel) */}
        {ROLES_IA.includes(role) && smartAlerts.length > 0 && (
          <div className="alert-banner">
            <div className="alert-icon"><TrendingUp size={22} /></div>
            <div>
              <h4 style={{ margin: 0, fontSize: '13px', textTransform: 'uppercase' }}>Anticipation Stratégique</h4>
              {smartAlerts.map((a, i) => (
                <p key={i} style={{ margin: '3px 0 0 0', fontSize: '15px' }}>{a.message} <strong>Conseil : {a.recommendation}</strong></p>
              ))}
            </div>
          </div>
        )}

        {/* CARTES DE STATISTIQUES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '35px' }}>
          <div className="stat-card">
            <span>Total Références</span>
            <h3>{products.length}</h3>
          </div>
          <div className="stat-card alert">
            <span>Alertes Stock</span>
            <h3>{products.filter(p => p.quantity <= p.min_threshold).length}</h3>
          </div>
          <div className="stat-card">
            <span>Valeur du Stock</span>
            <h3>{products.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)} DT</h3>
          </div>
        </div>

        {/* FORMULAIRE D'AJOUT RAPIDE */}
        {showAddForm && (
          <div className="add-form-card">
            <h3>Ajouter un nouvel article</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <input type="text" placeholder="Nom du produit" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} style={inputDashStyle} required />
              <input type="number" placeholder="Quantité" value={newProd.quantity} onChange={e => setNewProd({...newProd, quantity: e.target.value})} style={inputDashStyle} required />
              <input type="number" placeholder="Seuil alerte" value={newProd.min_threshold} onChange={e => setNewProd({...newProd, min_threshold: e.target.value})} style={inputDashStyle} />
              <input type="number" step="0.001" placeholder="Prix (DT)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} style={inputDashStyle} required />
              <button type="submit" className="btn-primary" style={{ gridColumn: 'span 4', justifyContent: 'center' }}>Enregistrer dans l'inventaire</button>
            </form>
          </div>
        )}

        {/* TABLEAU DES PRODUITS */}
        <div className="table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0 }}>Stock en temps réel</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
              <input type="text" placeholder="Rechercher un produit..." onChange={e => setSearch(e.target.value)} className="search-input" />
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Stock</th>
                <th>Prix Unitaire</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '700', color: '#1e293b' }}>{p.name}</td>
                  <td>{p.quantity} unités</td>
                  <td>{Number(p.price).toFixed(3)} DT</td>
                  <td>
                    <span className={`badge ${p.quantity <= p.min_threshold ? 'danger' : 'success'}`}>
                      {p.quantity <= p.min_threshold ? 'Rupture' : 'Stable'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {ROLES_STOCK.includes(role) && (
                        <button onClick={() => handleSell(p.id)} className="btn-action sell">Vendre</button>
                      )}
                      {(role === 'admin' || role === 'directeur') && (
                        <button onClick={() => deleteProduct(p.id)} className="btn-action delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* STYLES CSS LOCAUX */}
      <style>{`
        .nav-item { padding: 12px 15px; color: #94a3b8; display: flex; alignItems: center; gap: 12px; margin-bottom: 5px; cursor: pointer; border-radius: 10px; transition: 0.3s; font-weight: 500; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-item.active { background: rgba(51, 104, 196, 0.2); color: #3368c4; font-weight: 700; }
        
        .btn-primary { background: #023ab3; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-primary:hover { background: #103183; transform: translateY(-1px); }
        
        .btn-secondary { background: white; color: #023ab3; border: 1px solid #023ab3; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-secondary:hover { background: #f0f7ff; }

        .stat-card { background: white; padding: 22px; border-radius: 15px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .stat-card span { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-card h3 { margin: 10px 0 0 0; font-size: 24px; color: #0f172a; }
        .stat-card.alert { border-left: 4px solid #ef4444; }

        .alert-banner { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 18px 25px; border-radius: 12px; margin-bottom: 30px; display: flex; gap: 15px; color: #92400e; }
        .alert-icon { background: #f59e0b; color: white; padding: 10px; border-radius: 50%; display: flex; }

        .add-form-card { background: white; padding: 25px; border-radius: 15px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
        .add-form-card h3 { margin: 0 0 20px 0; font-size: 16px; }

        .table-card { background: white; padding: 30px; border-radius: 15px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04); }
        .search-input { padding: 10px 12px 10px 40px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; width: 250px; outline: none; transition: 0.2s; }
        .search-input:focus { border-color: #023ab3; background: white; }

        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { text-align: left; padding: 15px 12px; color: #64748b; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; letter-spacing: 1px; }
        .custom-table td { padding: 18px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        
        .badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge.success { background: #dcfce7; color: #166534; }
        .badge.danger { background: #fee2e2; color: #991b1b; }

        .btn-action { padding: 7px 14px; border-radius: 6px; cursor: pointer; border: none; font-size: 12px; font-weight: 700; transition: 0.2s; }
        .btn-action.sell { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .btn-action.sell:hover { background: #16a34a; color: white; }
        .btn-action.delete { background: #fff1f2; color: #e11d48; }
        .btn-action.delete:hover { background: #e11d48; color: white; }
      `}</style>
    </div>
  );
}

const inputDashStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none', fontSize: '14px' };