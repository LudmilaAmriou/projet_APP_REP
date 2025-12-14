
from .db_connect import create_app, db

# -----------------------------
# Create all tables
# -----------------------------
app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Les tables du TP – région BRESIL ont été créées avec succès !")
