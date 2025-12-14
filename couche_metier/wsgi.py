from couche_data.db_connect import create_app
from couche_metier.assistance_commerciale import assistance_bp
from couche_metier.general import general_bp
from couche_metier.recherche_developpement import rd_bp
from couche_metier.finance_gestion import finance_bp

app = create_app()

# Register blueprints
app.register_blueprint(assistance_bp)
app.register_blueprint(general_bp)
app.register_blueprint(rd_bp)
app.register_blueprint(finance_bp)
