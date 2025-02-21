"use client";

import React, { useState, useEffect } from "react";
import "./Home.css";
import { fetchUserData, fetchPosts } from "../../api/apiCalls";
import TweetCard from "../../components/tweet/TweetCard";
import { OPENAI_API_KEY, API_URL } from "../../api/config";
import useAuthGuard from "../../hooks/useAuthGuard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaperPlane, faFire } from "@fortawesome/free-solid-svg-icons"; // Ajout des icônes
import TopThemes from "../../components/topthemes/TopThemes";

const Home = () => {
  useAuthGuard();
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
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Analyse ces tweets et extrais les 5 sujets les plus fréquents sous forme de liste. Attention, ne répond que la liste des sujets. Fais comme si c'était le top tweet.",
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
    if (tweetText.trim() === "") return;

    const formData = new FormData();
    formData.append("content", tweetText);

    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8081/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const newPost = {
          ...data,
          avatar: user.avatar,
          username: user.username,
          display_name: user.display_name,
        };

        setPosts((prevPosts) => [newPost, ...prevPosts]);

        setTweetText("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };

  const handleDeleteTweet = (tweetId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== tweetId));
  };

  return (
    <div className="home">
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
              <FontAwesomeIcon icon={faImage} className="icon" /> {/* 📷 Icône d'image */}
              <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            </label>
            <button onClick={handleTweetSubmit} disabled={!tweetText.trim()} className="tweet-button">
              <FontAwesomeIcon icon={faPaperPlane} className="icon" /> {/* 🚀 Icône d'envoi */}
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
            posts.map((post) => (
              <TweetCard key={post.id} post={post} onDelete={handleDeleteTweet} />
            ))
          )}
        </div>

        <TopThemes topThemes={topThemes} />
      </div>
    </div>
  );
};

export default Home;
