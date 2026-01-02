# clear_db.py
from couche_data.db_connect import create_app, db

app = create_app()

with app.app_context():
    print("⚠️ Attention : Toutes les tables vont être supprimées !")
    
    # Drop all tables
    db.drop_all()
    print("🗑️ Toutes les tables ont été supprimées.")

    # Optional: commit if needed (usually drop_all commits automatically)
    db.session.commit()
    print("✅ Opération terminée.")