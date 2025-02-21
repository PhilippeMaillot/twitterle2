import React, { useState } from "react";
import { registerUser, loginUser } from "../../api/apiCalls";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("register");
    const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e, type) => {
        const { name, value } = e.target;
        type === "register"
            ? setRegisterData({ ...registerData, [name]: value })
            : setLoginData({ ...loginData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await registerUser(registerData.username, registerData.email, registerData.password);
        if (response?.message) {
            setMessage(response.message);
        } else {
            setMessage(response?.error || "Erreur lors de l'inscription");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await loginUser(loginData.email, loginData.password);
        if (response?.token) {
            localStorage.setItem("token", response.token);
            setMessage("Connexion réussie !");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } else {
            setMessage(response?.error || "Erreur lors de la connexion");
        }
    };

    return (
        <div className="auth-container">
            <div className="tabs">
                <button className={activeTab === "register" ? "active" : ""} onClick={() => setActiveTab("register")}>
                    Inscription
                </button>
                <button className={activeTab === "login" ? "active" : ""} onClick={() => setActiveTab("login")}>
                    Connexion
                </button>
            </div>

            <div className="auth-content">
                {activeTab === "register" ? (
                    <form onSubmit={handleRegister} className="auth-form">
                        <h2>Inscription</h2>
                        <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={(e) => handleChange(e, "register")} required />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="new-password"
                            onChange={(e) => handleChange(e, "register")}
                            required
                        />
                        <input type="password" name="password" placeholder="Mot de passe" onChange={(e) => handleChange(e, "register")} required />
                        <button type="submit">S'inscrire</button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="auth-form">
                        <h2>Connexion</h2>
                        <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e, "login")} required />
                        <input type="password" name="password" placeholder="Mot de passe" onChange={(e) => handleChange(e, "login")} required />
                        <button type="submit">Se connecter</button>
                    </form>
                )}
            </div>

            {message && <p className="auth-message">{message}</p>}
        </div>
    );
};

export default Auth;
