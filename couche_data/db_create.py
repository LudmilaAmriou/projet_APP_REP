
from couche_data.db_connect import create_app, db
import couche_data.db_tables

# -----------------------------
# Create all tables
# -----------------------------
app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Les tables du TP – région BRESIL ont été créées avec succès !")
