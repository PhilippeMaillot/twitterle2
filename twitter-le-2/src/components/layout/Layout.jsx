import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faEnvelope, faCog, faRobot, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

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
        {/* Logo Twitter */}
        <div className="logo-container">
          <img src="/twitter-logo.png" alt="Twitter Logo" className="twitter-logo" />
        </div>

        <ul>
          <li><Link to="/"><FontAwesomeIcon icon={faHome} className="icon" /> Accueil</Link></li>
          <li><Link to="/profile"><FontAwesomeIcon icon={faUser} className="icon" /> Profil</Link></li>
          <li><Link to="/messages"><FontAwesomeIcon icon={faEnvelope} className="icon" /> Messages</Link></li>
          <li><Link to="/krok"><FontAwesomeIcon icon={faRobot} className="icon" /> Krok</Link></li>
          <li><Link to="/settings"><FontAwesomeIcon icon={faCog} className="icon" /> Paramètres</Link></li>

          {isAuthenticated && (
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Déconnexion
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
