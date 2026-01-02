from faker import Faker
import random
from datetime import date, timedelta
from couche_data.db_connect import create_app, db
from couche_data.db_tables import ServicePersonnel, EtatPersonnel, Personnel, OperationCommerciale, TypeOperation, Article, EtatEmballage, Surveillance, Formation, DetectionForme

fake = Faker('pt_BR')

NB_PERSONNEL = 50
NB_OPERATIONS = 150
NB_ARTICLES = 200
NB_FORMATIONS = 20
NB_SURVEILLANCE = 10


app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()

    print("🧹 Tables réinitialisées…")

    # PERSONNEL
    personnel_list = []
    services = list(ServicePersonnel)
    etats = list(EtatPersonnel)

    for _ in range(NB_PERSONNEL):
        person = Personnel(
            id=fake.ssn(),
            nom_prenom=fake.name(),
            etat=random.choice(etats),
            service=random.choice(services),
            frequence_cardiaque=random.randint(60, 110),
            position=f"{fake.latitude():.5f},{fake.longitude():.5f}"
        )
        personnel_list.append(person)

    db.session.add_all(personnel_list)
    db.session.commit()

    print("👥 Personnel : OK")

    # OPERATIONS COMMERCIALES
    operations = []
    for _ in range(NB_OPERATIONS):
        personnel = random.choice(personnel_list)
        op = OperationCommerciale(
            type_op=random.choice(list(TypeOperation)),
            responsable_id=personnel.id,
            marge=round(random.uniform(200, 5000), 2),
            km_parcourus=round(random.uniform(5, 500), 2),
            mot_cle_responsable=fake.word(),
            mot_cle_client=fake.word()
        )
        operations.append(op)

    db.session.add_all(operations)
    db.session.commit()

    print("📈 Opérations : OK")

    # ARTICLES
    articles = []
    for i in range(NB_ARTICLES):
        personnel = random.choice(personnel_list)
        art = Article(
            id=1000 + i,
            zone=random.randint(1, 20),
            etat_emballage=random.choice(list(EtatEmballage)),
            responsable_id=personnel.id,
            position=f"{random.randint(0,10)},{random.randint(0,10)},{random.randint(0,10)}",
            rotation=f"{random.randint(0,360)},{random.randint(0,360)},{random.randint(0,360)}",
            collisions=random.randint(0, 10)
        )
        articles.append(art)

    db.session.add_all(articles)
    db.session.commit()

    print("📦 Articles : OK")

    # FORMATIONS
    formations = []
    for _ in range(NB_FORMATIONS):
        formations.append(
            Formation(
                nom_formation=fake.job(),
                sujet=random.choice(services),
                date_formation=date.today() - timedelta(days=random.randint(0, 1000)),
                pourcentage_engagement=random.randint(50, 100),
                pourcentage_satisfaction=random.randint(50, 100),
                mot_cle_formateur=fake.word(),
                mot_cle_personnel=fake.word()
            )
        )

    db.session.add_all(formations)
    db.session.commit()

    print("📚 Formations : OK")

    # SURVEILLANCE
    surveillance = []
    for zone in range(1, NB_SURVEILLANCE + 1):
        surveillance.append(
            Surveillance(
                zone=zone,
                drones_actifs=random.randint(0, 5),
                drones_panne=random.randint(0, 3),
                drones_rechargement=random.randint(0, 3),
                detection_incendie=random.choice([True, False]),
                detection_forme=random.choice(list(DetectionForme)),
                audit_conformite=random.choice([True, False])
            )
        )

    db.session.add_all(surveillance)
    db.session.commit()

    print("🛰️ Surveillance : OK")

    print("🎉 Base remplie avec plein de données réalistes !")
