import enum
from .db_connect import db

# Charger les variables d'env

# -----------------------------
# Enums
# -----------------------------
class EtatPersonnel(enum.Enum):
    actif = "actif"
    repos = "repos"
    arret_maladie = "arrêt maladie"
    conge = "congé"

class ServicePersonnel(enum.Enum):
    commercial = "commercial"
    finance_gestion = "finance et gestion"
    rh = "ressources humaines"
    juridique = "juridique"
    logistique = "logistique"
    assistance_commerciale = "assistance commerciale"
    direction_generale = "direction générale"
    maintenance = "maintenance"
    achats = "achats"
    cyber_securite = "cyber sécurité"
    recherche_developpement = "recherche et développement"
    informatique = "informatique"
    qualite = "qualité"
    collecte = "collecte"
    marketing = "marketing"
    industriel = "industriel"
    assistance_technique = "assistance technique"
    analyse_donnees = "analyse des données"

class TypeOperation(enum.Enum):
    achat = "Achat"
    vente = "Vente"

class EtatEmballage(enum.Enum):
    correct = "Correct"
    defo = "Déformé"

class DetectionForme(enum.Enum):
    aucune = "aucune"
    personnel_non_identifie = "personnel non identifiée"
    objet_non_identifie = "objet non identifié"

# -----------------------------
# 1️⃣ Personnel
# -----------------------------
class Personnel(db.Model):
    __tablename__ = 'personnel'
    id = db.Column(db.String, primary_key=True)  # Numéro de sécurité sociale
    nom_prenom = db.Column(db.String, nullable=False)
    etat = db.Column(db.Enum(EtatPersonnel), nullable=False)
    service = db.Column(db.Enum(ServicePersonnel), nullable=False)
    frequence_cardiaque = db.Column(db.Integer)
    position = db.Column(db.String)  # GPS "lat,lon"

    # Relations : 
    '''
    Ces relations nous permettent d'accéder facilement à toutes les opérations et articles
    liés à un membre du personnel.
    - 'operations' sera une liste d'objets OperationCommerciale pour cette personne.
    - 'articles' sera une liste d'objets Article pour cette personne.
    Le 'backref="responsable"' ajoute automatiquement un attribut 'responsable' dans les tables enfants,
    donc depuis une OperationCommerciale ou un Article, on peut rapidement accéder au Personnel correspondant.'''
    
    operations = db.relationship('OperationCommerciale', backref='responsable')
    articles = db.relationship('Article', backref='responsable')

# -----------------------------
# 2️⃣ Opérations commerciales
# -----------------------------
class OperationCommerciale(db.Model):
    __tablename__ = 'operations_commerciales'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_op = db.Column(db.Enum(TypeOperation), nullable=False)
    responsable_id = db.Column(db.String, db.ForeignKey('personnel.id'))
    marge = db.Column(db.Float)
    km_parcourus = db.Column(db.Float)
    mot_cle_responsable = db.Column(db.String)
    mot_cle_client = db.Column(db.String)

# -----------------------------
# 3️⃣ Formations
# -----------------------------
class Formation(db.Model):
    __tablename__ = 'formations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom_formation = db.Column(db.String, nullable=False)
    sujet = db.Column(db.Enum(ServicePersonnel))  # reuse ServicePersonnel enum
    date_formation = db.Column(db.Date)
    pourcentage_engagement = db.Column(db.Float)
    pourcentage_satisfaction = db.Column(db.Float)
    mot_cle_formateur = db.Column(db.String)
    mot_cle_personnel = db.Column(db.String)

# -----------------------------
# 4️⃣ Articles
# -----------------------------
class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Identifiant du produit
    zone = db.Column(db.Integer, nullable=False)  # Unique per Innov3D group
    etat_emballage = db.Column(db.Enum(EtatEmballage))
    responsable_id = db.Column(db.String, db.ForeignKey('personnel.id'))
    position = db.Column(db.String)  # 3 coords "x,y,z"
    rotation = db.Column(db.String)  # Euler angles "x,y,z"
    collisions = db.Column(db.Integer)

# -----------------------------
# 5️⃣ Surveillance
# -----------------------------
class Surveillance(db.Model):
    __tablename__ = 'surveillance'
    zone = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Unique per Innov3D group
    drones_actifs = db.Column(db.Integer)
    drones_panne = db.Column(db.Integer)
    drones_rechargement = db.Column(db.Integer)
    detection_incendie = db.Column(db.Boolean)
    detection_forme = db.Column(db.Enum(DetectionForme))
    audit_conformite = db.Column(db.Boolean)
