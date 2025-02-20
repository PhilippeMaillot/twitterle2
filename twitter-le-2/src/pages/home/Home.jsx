"use client";

import React, { useState, useEffect } from "react";
import "./Home.css";
import { fetchUserData, fetchPosts } from "../../api/apiCalls";
import TweetCard from "../../components/tweet/TweetCard";
import { OPENAI_API_KEY } from "../../api/config";


const API_URL = "https://api.openai.com/v1/chat/completions";

const Home = () => {
  const [user, setUser] = useState(null);
  const [tweetText, setTweetText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [topThemes, setTopThemes] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUserData();
      setUser(userData);
    };
    getUser();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);

      if (postsData.length > 0) {
        analyzeTopThemes(postsData.slice(0, 10)); // On prend les 10 derniers posts
      }
    };
    loadPosts();
  }, []);

  const analyzeTopThemes = async (latestPosts) => {
    const postContents = latestPosts.map((post) => post.content).join(",\n");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Analyse ces tweets et extrais les 5 sujets les plus fréquents sous forme de liste. Attention, ne répond que la liste des sujets. et Fais comme si c'était le top tweet",
            },
            { role: "user", content: postContents },
          ],
        }),
      });

      if (!response.ok) throw new Error("Erreur de l'API");

      const data = await response.json();

      setTopThemes(
        data.choices?.[0]?.message?.content?.split("\n").slice(0, 5) || []
      );
    } catch (error) {
      console.error("❌ Erreur lors de l'analyse des sujets :", error);
      setTopThemes(["Erreur lors de l'analyse"]);
    }
  };

  const handleTweetChange = (e) => {
    setTweetText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTweetSubmit = async () => {
    if (tweetText.trim() === "") {
      console.error("❌ Impossible d'envoyer un tweet vide.");
      return;
    }

    const formData = new FormData();
    formData.append("content", tweetText);

    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Utilisateur non authentifié.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPosts([data, ...posts]);
        setTweetText("");
        setImage(null);

        analyzeTopThemes([data, ...posts].slice(0, 10)); // Mise à jour des thèmes
      } else {
        console.error("❌ Erreur :", data.error);
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };

  return (
    <div className="home">
      <h2>Accueil</h2>

      {/* 🔹 Boîte de tweet */}
      <div className="tweet-box">
        <img
          src={
            user && user.avatar
              ? `http://localhost:8081/uploads/${user.avatar}`
              : "http://localhost:8081/uploads/base_avatar.png"
          }
          alt="Avatar"
          className="avatar"
        />
        <div className="tweet-content">
          <textarea
            placeholder="Quoi de neuf ?"
            value={tweetText}
            onChange={handleTweetChange}
            className="tweet-input"
          ></textarea>
          {imagePreview && (
            <img src={imagePreview} alt="Prévisualisation" className="tweet-preview" />
          )}
          <div className="tweet-actions">
            <label className="file-label">
              📷
              <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            </label>
            <button onClick={handleTweetSubmit} disabled={!tweetText.trim()} className="tweet-button">
              Tweeter
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Section des tweets */}
      <div className="content-sections">
        {/* ✅ Colonne 1 : Les tweets */}
        <div className="posts">
          {posts.length === 0 ? (
            <p>Aucun tweet pour l'instant.</p>
          ) : (
            posts.map((post) => <TweetCard key={post.id} post={post} />)
          )}
        </div>

        {/* ✅ Colonne 2 : Top 5 des sujets les plus traités */}
        <div className="top-themes">
          <h3>Top tweets</h3>
          {topThemes.length === 0 ? (
            <p>Analyse en cours...</p>
          ) : (
            <ul>
              {topThemes.map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
