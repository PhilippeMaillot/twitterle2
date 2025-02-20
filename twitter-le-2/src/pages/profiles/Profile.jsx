import React, { useState, useEffect } from "react";
import "./Profile.css";
import { fetchUserProfile } from "../../api/apiCalls";
import TweetCard from "../../components/tweet/TweetCard";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("tweets");

  // Stocke les fichiers sélectionnés (avatar et bannière) pour l'envoi futur à l'API
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // Stocke l'aperçu des images avant enregistrement
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const userData = await fetchUserProfile();
      if (userData) {
        setProfile(userData);
      }
    };
    loadProfile();
  }, []);

  if (!profile) {
    return <p>Chargement du profil...</p>;
  }

  // 📌 Gestion du changement d'avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file)); // Affichage temporaire
    }
  };

  // 📌 Gestion du changement de bannière
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBanner(file);
      setPreviewBanner(URL.createObjectURL(file)); // Affichage temporaire
    }
  };

  return (
    <div className="profile">
      {/* Bannière */}
      <div className="banner">
        <label htmlFor="banner-upload">
          <img
            src={previewBanner || (profile.banner ? `http://localhost:8081/uploads/${profile.banner}` : "http://localhost:8081/uploads/base_banner.jpeg")}
            alt="Bannière du profil"
            className="clickable-image"
          />
        </label>
        <input type="file" id="banner-upload" accept="image/*" onChange={handleBannerChange} style={{ display: "none" }} />
      </div>

      {/* Photo de profil et infos */}
      <div className="profile-header">
        <label htmlFor="avatar-upload">
          <img
            className="avatar clickable-image"
            src={previewAvatar || (profile.avatar ? `http://localhost:8081/uploads/${profile.avatar}` : "http://localhost:8081/uploads/base_avatar.png")}
            alt="Photo de profil"
          />
        </label>
        <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />

        <div className="user-info">
          <h2>{profile.username}</h2>
          <p>{profile.display_name}</p>
          <p className="bio">{profile.bio}</p>
        </div>
      </div>

      {/* Onglets (Tweets / Likes) */}
      <div className="tabs">
        <button className={activeTab === "tweets" ? "active" : ""} onClick={() => setActiveTab("tweets")}>
          📢 Tweets
        </button>
        <button className={activeTab === "likes" ? "active" : ""} onClick={() => setActiveTab("likes")}>
          ❤️ Likes
        </button>
      </div>

      {/* Contenu de l’onglet actif */}
      <div className="tab-content">
        {activeTab === "tweets" ? (
          <div className="tweets-section">
            {profile.tweets.length > 0 ? (
              profile.tweets.map((tweet) => <TweetCard key={tweet.id} post={tweet} />)
            ) : (
              <p>Aucun tweet pour le moment.</p>
            )}
          </div>
        ) : (
          <div className="liked-tweets-section">
            {profile.likedTweets.length > 0 ? (
              profile.likedTweets.map((tweet) => <TweetCard key={tweet.id} post={tweet} />)
            ) : (
              <p>Aucun tweet liké.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
