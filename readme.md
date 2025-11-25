# 📜 Danstonchat Scraper

## 🧩 Objectif du projet

Ce projet a pour but de **récupérer automatiquement l’ensemble des citations** (aussi appelées _quotes_) publiées sur le site [danstonchat.com](https://danstonchat.com/), qui recense des extraits humoristiques de conversations Internet.

Les données extraites sont ensuite **structurées et insérées dans une base de données PostgreSQL**, afin de pouvoir être exploitées ultérieurement (analyse, recherche, affichage sur une autre interface, etc.).

---

## ⚙️ Fonctionnement général

1. **Récupération d’une quote**

   - Le script commence à partir de la première quote :  
     [https://danstonchat.com/quote/1.html](https://danstonchat.com/quote/1.html)
   - Une requête HTTP (GET) est effectuée pour récupérer le contenu HTML de la page.

2. **Extraction des informations**

   - Le contenu de la quote (texte principal, auteur(s), date, identifiant, etc.) est extrait du HTML.
   - Si la quote est une **image** (et non du texte), elle est simplement identifiée comme une quote de type _image_ et le contenu est ignorée pour l’insertion.

3. **Insertion en base de données**

   - Les données nettoyées et structurées sont insérées dans une table PostgreSQL prévue à cet effet.
   - Chaque entrée contient les champs essentiels : identifiant, texte, type, date, etc. (voir section schéma ci-dessous).

4. **Navigation vers la quote suivante**
   - Le script détecte le lien du bouton **"Suivant"** sur la page courante.
   - Il récupère l’URL correspondante et répète le processus de scraping pour la page suivante.
   - L’opération continue jusqu’à ce qu’il n’existe plus de page suivante (fin du corpus).

---

## 🗃️ Structure des données (fonctionnelle)

### Table quotes

| Champ         | Description                                                              | Exemple                                        |
| ------------- | ------------------------------------------------------------------------ | ---------------------------------------------- |
| `id`          | Identifiant unique de la quote dans la base postgres (ordre de création) | `1234`                                         |
| `title`       | Titre de la quote                                                        | `😗🎂 Level up`                                  |
| `url`         | URL complète de la quote                                                 | `https://danstonchat.com/quote/1234.html`      |
| `type`        | Type de quote : `text` ou `image`                                        | `TEXT`                                         |
| `author`      | Auteur de la quote                                                       | `thxDuck`                                      |
| `raw_content` | Contenu textuel brut (si type = text)                                    | `"<thxDuck> : T'as fait quoi hier soir ? ..."` |
| `posted_at`   | Date de récupération ou date d’origine (si disponible)                   | `2012-01-04T12:52:00Z`                         |
| `scraped_at`  | Date de récupération ou date d’origine (si disponible)                   | `2025-11-13T14:32:00Z`                         |


### Table lines

| Champ           | Description                                                     | Description                  |
| --------------- | --------------------------------------------------------------- | ---------------------------- |
| `id`            | Identifiant de la ligne                                         | 4321                         |
| `quote_id`      | Foreign key vers l'id de la quote liée                          | 1234                         |
| `speaker_name`  | Auteur de la ligne (peut être null)                             | "<thxDuck>"                  |
| `speaker_color` | Couleur donnée a l'auteur de  la ligne (récupérée dans le HTML) | "red"                        |
| `message`       | Contenu de la ligne                                             | "T'as fait quoi hier soir ?" |
| `order_index`   | Ordre de la ligne dans la quote                                 | 1                            |

---

## 🧱 Structure du projet (prévisionnelle)

```bash
/dtc-scraper
│
├── tests/
│   ├── acceptance/ # Tests d'acceptances
│   └── unit/       # Tests unitaires
│
├── src/
│   ├── main.ts
│   ├── scraper/    # Gestion du scraping, des erreurs et des délais
│   ├── parser/     # Récupération des éléments a partir d'une page HTML
│   ├── db/         # Connexion et insertion de la base de données
│   └── utils/      # Utilitaires (Loggers, helpers...)
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🧰 Installation & exécution

### Prérequis

- Nodejs v24
- pnpm
- Docker (postgres)

---

## 🔮 Évolutions possibles

- Gestion des quotes sous forme d’images
- Interface web de visualisation et de recherche
- Intégration avec une API REST publique

## Ressources

### Liens de quotes spécifiques : 

- **Article de Remouk** : <https://danstonchat.com/blog/20-ans.html>

---

## 🪪 Licence

Projet open source – licence MIT
