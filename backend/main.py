from fastapi import FastAPI, Form, HTTPException, Depends, UploadFile, File
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import csv
import io
from datetime import datetime, timedelta

app = FastAPI()

# --- CONFIGURATION SÉCURITÉ (CORS) ---
# Autorise le Frontend React (port 5173) à communiquer avec Python (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODÈLES DE DONNÉES (TABLES SQL) ---

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    mot_de_passe: str
    entreprise: str
    nom: Optional[str] = None
    role: Optional[str] = None

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    quantity: int
    min_threshold: int
    price: float
    entreprise: str 

class Sale(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_name: str
    quantity_sold: int
    date: datetime = Field(default_factory=datetime.now)
    entreprise: str

# --- CONFIGURATION BASE DE DONNÉES (SQLite) ---
sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url, echo=False)

# Création des tables au démarrage du serveur
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# --- ROUTES AUTHENTIFICATION ---

@app.post("/inscription")
def signup(
    email: str = Form(...), 
    mot_de_passe: str = Form(...), 
    entreprise: str = Form(...),
    nom: Optional[str] = Form(None),
    role: Optional[str] = Form(None)
):
    with Session(engine) as session:
        entreprise_clean = entreprise.strip().lower()
        statement = select(User).where(User.email == email)
        if session.exec(statement).first():
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
        
        new_user = User(
            email=email, 
            mot_de_passe=mot_de_passe, 
            entreprise=entreprise_clean, 
            nom=nom, 
            role=role
        )
        session.add(new_user)
        session.commit()
        return {"status": "success", "message": "Compte créé"}

@app.post("/connexion")
def login(email: str = Form(...), mot_de_passe: str = Form(...)):
    with Session(engine) as session:
        statement = select(User).where(User.email == email, User.mot_de_passe == mot_de_passe)
        user = session.exec(statement).first()
        
        if user:
            return {
                "status": "success", 
                "role": user.role,
                "entreprise": user.entreprise.strip().lower(),
                "user_email": user.email
            }
        else:
            raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

# --- ROUTES PRODUITS (CRUD) ---

@app.get("/api/products", response_model=List[Product])
def get_products(entreprise: str):
    with Session(engine) as session:
        entreprise_clean = entreprise.strip().lower()
        statement = select(Product).where(Product.entreprise == entreprise_clean)
        return session.exec(statement).all()

@app.post("/api/products")
def add_product(product: Product):
    with Session(engine) as session:
        product.entreprise = product.entreprise.strip().lower()
        session.add(product)
        session.commit()
        session.refresh(product)
        return product
    
@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if product:
            session.delete(product)
            session.commit()
            return {"ok": True}
        raise HTTPException(status_code=404, detail="Produit non trouvé")

@app.post("/api/products/sell/{product_id}")
def sell_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if not product or product.quantity <= 0:
            raise HTTPException(status_code=400, detail="Stock insuffisant")
        
        # 1. Mise à jour du stock
        product.quantity -= 1
        
        # 2. Enregistrement de la vente
        new_sale = Sale(
            product_name=product.name, 
            quantity_sold=1, 
            entreprise=product.entreprise,
            date=datetime.now()
        )
        session.add(product)
        session.add(new_sale)
        session.commit()
        return {"message": "Vente réussie"}

# --- ROUTE HISTORIQUE DES VENTES ---

@app.get("/api/sales", response_model=List[Sale])
def get_sales(entreprise: str):
    with Session(engine) as session:
        entreprise_clean = entreprise.strip().lower()
        statement = select(Sale).where(Sale.entreprise == entreprise_clean).order_by(Sale.date.desc())
        return session.exec(statement).all()

# --- IMPORTATION CSV ---

@app.post("/api/products/import")
async def import_csv(entreprise: str, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Le fichier doit être au format .csv")
    
    content = await file.read()
    data = content.decode('utf-8').splitlines()
    csv_reader = csv.DictReader(data)
    
    with Session(engine) as session:
        entreprise_clean = entreprise.strip().lower()
        for row in csv_reader:
            try:
                name_clean = row['name'].strip()
                # Éviter les doublons : mettre à jour si le produit existe déjà
                exist = session.exec(select(Product).where(
                    Product.name == name_clean, 
                    Product.entreprise == entreprise_clean
                )).first()
                
                if exist:
                    exist.quantity += int(row['quantity'])
                else:
                    new_product = Product(
                        name=name_clean,
                        quantity=int(row['quantity']),
                        min_threshold=int(row['min_threshold']),
                        price=float(row['price']),
                        entreprise=entreprise_clean
                    )
                    session.add(new_product)
            except KeyError as e:
                raise HTTPException(status_code=400, detail=f"Colonne manquante : {e}")
        
        session.commit()
    return {"status": "success", "message": "Importation réussie"}

# --- ALGORITHMES D'ANALYSE (LOGIQUE SMART) ---


@app.get("/api/analytics/dormant")
def get_dormant_products(entreprise: str):
    with Session(engine) as session:
        entreprise_clean = entreprise.strip().lower()
        
        # 1. Tous les produits de la société
        all_products = session.exec(select(Product).where(Product.entreprise == entreprise_clean)).all()
        
        # 2. Ventes des 30 derniers jours
        date_limite = datetime.now() - timedelta(days=30)
        recent_sales = session.exec(
            select(Sale.product_name).where(
                Sale.entreprise == entreprise_clean, 
                Sale.date > date_limite
            )
        ).all()
        
        # 3. Filtrage des produits n'ayant aucune vente récente
        sold_names = set(recent_sales)
        dormant = [p for p in all_products if p.name not in sold_names]
        
        return dormant