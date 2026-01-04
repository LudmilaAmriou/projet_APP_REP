from flask import Flask

from ..couche_data.db_connect import create_app
from .assistance_commerciale import assistance_bp
from .general import general_bp , write_bp
from .recherche_developpement import rd_bp
from .finance_gestion import finance_bp



app = create_app()


#  Enregistrement des Blueprints
app.register_blueprint(assistance_bp)
app.register_blueprint(general_bp)
app.register_blueprint(write_bp)
app.register_blueprint(rd_bp)
app.register_blueprint(finance_bp)

if __name__ == "__main__":
    app.run(debug=True)

