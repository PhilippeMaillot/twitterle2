# 🕊 Twitter Le 2 - Clone de Twitter avec React et Node.js

## 🚀 Description
Twitter Le 2 est un clone de Twitter développé avec **React.js** pour le frontend et **Node.js avec MySQL** pour le backend.  
Ce projet permet aux utilisateurs de publier des tweets, aimer des posts, envoyer des messages et personnaliser leur profil.

## 📌 Fonctionnalités
- ✅ **Authentification utilisateur** (Inscription & Connexion)  
- ✅ **Publication de tweets avec images**  
- ✅ **Système de likes**  
- ✅ **Messagerie en temps réel avec WebSockets**  
- ✅ **Personnalisation du profil (avatar, bannière, bio, etc.)**  
- ✅ **Krok - IA intégrée pour générer des tweets attractifs**  
- ✅ **Affichage des tendances (analyse des sujets populaires avec IA)**  

---

## 🛠 Technologies utilisées
### Frontend :
- ⚛️ React.js (Vite)
- 🎨 CSS3 (styles personnalisés)
- 📦 FontAwesome pour les icônes
- 📡 Socket.io-client pour la messagerie en temps réel

### Backend :
- 🟢 Node.js & Express.js
- 🗄 MySQL (gestion des utilisateurs, tweets et messages)
- 🛠 Bcrypt.js (hachage des mots de passe)
- 🔐 JWT (JSON Web Token) pour l'authentification
- 📡 Socket.io pour la communication en temps réel

---

## 🏗 Installation
### 1️⃣ Cloner le projet
```sh
git clone https://github.com/PhilippeMaillot/twitterle2.git
cd twitter-le-2
```

### 2️⃣ Installer les dépendances
#### Backend :
```sh
cd backend
npm install
```
#### Frontend :
```sh
cd frontend
npm install
```

### 3️⃣ Configurer l'environnement
#### Backend (`.env`)
Crée un fichier `.env` à la racine du dossier **backend** et ajoute :
```env
PORT=8081
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mot_de_passe
DB_NAME=twitter2
JWT_SECRET=ton_secret_jwt
```

#### Frontend (`config.js`)
Modifie le fichier **`src/api/config.js`** :
```js
export const API_URL = "http://localhost:8081";
export const OPENAI_API_KEY = "ta_cle_openai";
```

### 4️⃣ Lancer le projet
#### Démarrer le serveur backend
```sh
cd backend
npm start
```
#### Démarrer le frontend
```sh
cd frontend
npm run dev
```

---

## 📸 Captures d'écran
### 🎭 Page d'accueil
![Home](public/screenshots/home.png)

### 💬 Messagerie en temps réel
![Messages](public/screenshots/messages.png)

### 🤖 Krok - IA intégrée
![Krok AI](public/screenshots/krok.png)

---

## 🤝 Contribuer
Les contributions sont les bienvenues ! 🎉  
Forke le projet, crée une branche et soumets une **pull request**.

---

## 📄 License
Ce projet est sous licence **MIT**.  
👨‍💻 Développé avec ❤️ par **[Ton Nom]**.

