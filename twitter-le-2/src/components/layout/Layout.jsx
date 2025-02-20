import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Layout.css";

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Si un token existe, l'utilisateur est connecté
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setIsAuthenticated(false); // Met à jour l'état
    navigate("/auth"); // Redirige vers la page de connexion
  };

  return (
    <div className="layout">
      {/* Barre latérale */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/">🏠 Accueil</Link></li>
          <li><Link to="/profile">👤 Profil</Link></li>
          <li><Link to="/messages">✉️ Messages</Link></li>
          <li><Link to="/krok">🦘 Krok</Link></li>
          <li><Link to="/settings">⚙️ Paramètres</Link></li>

          {/* Ajout du bouton Déconnexion dans un <li> */}
          {isAuthenticated && (
            <li>
              <button className="logout-button" onClick={handleLogout}>
                🚪 Déconnexion
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Contenu principal */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
