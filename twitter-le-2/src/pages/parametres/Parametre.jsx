import React, { useState, useEffect } from "react";
import "./Parametre.css";
import { fetchUserData } from "../../api/apiCalls";

const Parametre = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            const user = await fetchUserData();
            if (user) {
                setUserData(user);
                setFormData({
                    username: user.username,
                    bio: user.bio || "",
                    email: user.email,
                    password: "",
                });
            }
        };
        loadUserData();
    }, []);

    if (!userData) {
        return <p className="loading">Chargement des paramètres...</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        if (!formData.username || !formData.email) {
            setMessage("Le nom d'utilisateur et l'email sont obligatoires !");
            return;
        }

        // 🔹 Créer une copie de formData
        const updatedData = { ...formData };

        // 🔹 Supprimer le champ `password` s'il est vide
        if (!updatedData.password.trim()) {
            delete updatedData.password;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8081/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData), // 🔥 Envoi des données SANS password si vide
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ Modifications enregistrées !");
                setUserData(data);
            } else {
                setMessage(`Erreur : ${data.error || "Modification échouée"}`);
            }
        } catch (error) {
            setMessage("Erreur réseau, réessayez plus tard.");
        }
    };

    return (
        <div className="parametre-container">
            <h2>⚙️ Paramètres</h2>

            {message && <p className="message">{message}</p>}

            <div className="parametre-form">
                <label>Nom d'utilisateur :</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <label>Bio :</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                />

                <label>Email :</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <label>Mot de passe (laisser vide pour ne pas changer) :</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Nouveau mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                />

                <button className="save-button" onClick={handleSaveChanges}>
                    Enregistrer les modifications
                </button>
            </div>
        </div>
    );
};

export default Parametre;
