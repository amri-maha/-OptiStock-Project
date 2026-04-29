import React, { useState, useEffect } from 'react';
import axios from 'axios';/*chercher les données sur ton serveur Python.*/
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { ArrowLeft, TrendingUp, DollarSign, Package, ShoppingCart } from 'lucide-react';

const COLORS = ['#00D8FF', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00FF95'];

export default function Analytics() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const entreprise = localStorage.getItem('userEntreprise');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await axios.get(`http://localhost:8000/api/products?entreprise=${entreprise}`);
        setProducts(resProd.data);
        const resSales = await axios.get(`http://localhost:8000/api/sales?entreprise=${entreprise}`);
        setSales(resSales.data);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, [entreprise]);

  const getSalesSummary = () => {
    const summary = {};
    sales.forEach(s => { summary[s.product_name] = (summary[s.product_name] || 0) + s.quantity_sold; });
    return Object.entries(summary).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  };

  const salesData = getSalesSummary();
  const topProduct = salesData.length > 0 ? salesData[0] : { name: "N/A", total: 0 };
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.quantity)), 0);
  const [dormantProducts, setDormantProducts] = useState([]);

  useEffect(() => {
    const fetchDormant = async () => {
      const res = await axios.get(`http://localhost:8000/api/analytics/dormant?entreprise=${entreprise}`);
      setDormantProducts(res.data);
    };
    fetchDormant();
  }, [entreprise]);

// --- CALCUL DES PRODUITS EN SEUIL CRITIQUE ---
const criticalProducts = products.filter(p => p.quantity <= p.min_threshold);
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#040c15', color: 'white', padding: '30px', fontFamily: 'Barlow, sans-serif' }}>
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#023ab3', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Dashboard
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#00D8FF', margin: 0 }}>ANALYSES PERFORMANCE - {entreprise?.toUpperCase()}</h1>
      </header>
      #Les Cartes de Résumé
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="ana-card blue"><TrendingUp /> <div><p>Stock Total</p><h3>{products.reduce((acc, p) => acc + Number(p.quantity), 0)}</h3></div></div>
        <div className="ana-card purple"><DollarSign /> <div><p>Valeur</p><h3>{totalValue.toFixed(2)} DT</h3></div></div>
        <div className="ana-card gold"><ShoppingCart /> <div><p>Top Vendu</p><h3>{topProduct.name}</h3></div></div>
        <div className="ana-card cyan"><Package /> <div><p>Articles</p><h3>{products.length}</h3></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        
        {/* GRAPHIQUE 1 : QUANTITÉS DISPONIBLES */}
        <div className="chart-box">
          <h3 style={{ fontSize: '15px', color: '#00D8FF', marginBottom: '20px' }}>📦 État des Stocks Actuels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              
              {/* Modification ici : tick={false} pour cacher les noms, tickLine={false} pour cacher les petits traits */}
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={false} 
                tickLine={false} 
              />
              
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#040c15', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#00D8FF' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              />
              <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                {products.map((p, i) => (
                  <Cell key={i} fill={p.quantity <= p.min_threshold ? '#ff0037' : '#00D8FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 2 : TOP VENTES */}
        <div className="chart-box">
          <h3 style={{ fontSize: '15px', color: '#f40092', marginBottom: '20px' }}>🔥 Analyse des Ventes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ bottom: 60 }}>
              <XAxis dataKey="name" stroke="#3569b3" fontSize={10} angle={-45} textAnchor="end" interval={0} />
              <YAxis stroke="#3a75c8" />
              <Tooltip contentStyle={{ backgroundColor: '#040c15', border: '1px solid #334155' }} />
              <Bar dataKey="total" fill="#b00055" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 3 : RÉPARTITION FINANCIÈRE (PIE) */}
        <div className="chart-box" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '15px', color: '#9966FF', marginBottom: '20px' }}>💰 Poids Financier par Produit (Valeur Totale)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={products.map(p => ({ name: p.name, value: p.price * p.quantity }))} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}>
                {products.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* HISTORIQUE DES VENTES (TABLEAU) */}
        <div className="chart-box" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>🕒 Dernières transactions</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Produit</th>
                  <th>Quantité</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px', color: '#00D8FF' }}>{s.product_name}</td>
                    <td>{s.quantity_sold}</td>
                    <td style={{ color: '#64748b' }}>{new Date(s.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* --- 6. GRAPHIQUE ROUGE : PRODUITS EN SEUIL CRITIQUE --- */}
        <div className="chart-box" style={{ border: '1px solid #bd0000' }}>
          <h3 style={{ color: '#bd0000', fontSize: '16px', marginBottom: '20px' }}>
            ⚠️ Alerte Rupture : Seuil Critique Atteint
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={criticalProducts}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#040c15', border: 'none' }} />
              <Bar dataKey="quantity" fill="#bd0000" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#fff' }} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
            Ces {criticalProducts.length} produits doivent être recommandés immédiatement.
          </p>
        </div>
        {/* --- 8. BLOC : PRODUITS DORMANTS (PERTE D'ARGENT) --- */}
        <div className="chart-box" style={{ border: '1px solid #9966FF' }}>
          <h3 style={{ color: '#9966FF', fontSize: '16px', marginBottom: '20px' }}>
            💤 Produits Dormants (Inactifs depuis 30 jours)
          </h3>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {dormantProducts.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {dormantProducts.map((p, i) => (
                  <li key={i} style={{ padding: '10px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.name}</span>
                    <span style={{ color: '#9966FF', fontWeight: 'bold' }}>{p.quantity} en stock</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#16a34a' }}>✅ Tous vos produits circulent bien !</p>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
            Conseil : Faites une promotion pour déstocker ces articles.
          </p>
        </div>


      </div>
      <style>{`
        .ana-card { padding: 20px; border-radius: 15px; display: flex; align-items: center; gap: 15px; }
        .ana-card p { margin: 0; opacity: 0.7; font-size: 11px; text-transform: uppercase; }
        .ana-card h3 { margin: 5px 0 0 0; font-size: 18px; font-weight: 800; }
        .blue { background: linear-gradient(135deg, #023ab3, #0091ca); }
        .purple { background: linear-gradient(135deg, #8500a6, #7b51be); }
        .gold { background: linear-gradient(135deg, #d9067e, #f50ba3); }
        .cyan { background: linear-gradient(135deg, #0083bf, #006aac); }
        .chart-box { background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); }
      `}</style>
    </div>
  );
}