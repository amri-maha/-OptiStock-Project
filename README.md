# -OptiStock-Project
--> OptiStock - Smart Inventory Management
OptiStock est une solution Full-Stack moderne de gestion de stock conçue pour les entreprises (SaaS). Elle permet une gestion multi-entreprises sécurisée, des analyses de données en temps réel et une interface intuitive adaptée à différents rôles utilisateurs (Admin, Vendeur, Comptable).

 1-Fonctionnalités Clés
* Multi-Tenancy (Multi-Entreprise)
    L'application est conçue pour isoler les données. Chaque entreprise (ex: Agro, Adidas) dispose      de son propre inventaire, de ses utilisateurs et de ses statistiques privées.
* Gestion des Rôles (RBAC)
    Accès personnalisé selon le poste occupé :
    Admin / Directeur : Contrôle total, importation CSV, suppression et accès aux analyses avancées.
    Vendeur : Consultation du stock et enregistrement des ventes uniquement.
    Comptable : Accès aux rapports financiers et à la valeur de l'inventaire.
2-Intelligence Métier & BI
    Produits Dormants : Identification automatique des articles sans vente depuis 30 jours.
    Tableaux de Bord Dynamiques : Graphiques interactifs (Recharts) pour visualiser les stocks et       les performances de vente.
3- Outils Productivité
    Import CSV : Chargement massif de catalogues de produits en un clic.
    Mode Sombre (Analytics) : Interface haute performance pour l'analyse de données.
4-Tech Stack
  *Frontend :
    React.js (Vite)
    React Router (Navigation SPA)
    Recharts (Visualisation de données)
    Axios (Appels API)
    Lucide-React (Iconographie)
  *Backend :
    FastAPI (Python)
    SQLModel / SQLAlchemy (ORM)
    SQLite (Base de données relationnelle)
    CSV / Io (Traitement de fichiers)


├── backend/
│   ├── main.py          # Logique API, Routes et Algorithmes
│   ├── database.db      # Base de données SQLite
│   └── venv/            # Environnement virtuel
└── frontend/
    ├── src/
    │   ├── pages/       # Home, Login, Register, Dashboard, Analytics, Settings
    │   ├── App.jsx      # Configuration des routes
    │   └── main.jsx     # Point d'entrée React
    └── package.json     # Dépendances Frontend
5-Algorithmes Implémentés
    Filtrage Multi-Tenant : Chaque requête SQL est filtrée dynamiquement par le champ entreprise récupéré dans le LocalStorage.
    Analyse de Rupture : Détection automatique des produits où quantité <= seuil_critique.
    Agrégation des Ventes : Algorithme de traitement de données pour transformer des milliers de transactions en un graphique de "Top Ventes".
Auteur Maha Amri
