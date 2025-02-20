import React, { useState, useEffect } from "react";
import "./Profile.css";
import { fetchUserProfile } from "../../api/apiCalls";
import { changeAvatar, changeBanner } from "../../api/apiCalls"; // ✅ Import de la fonction pour changer d'avatar
import TweetCard from "../../components/tweet/TweetCard";
import useAuthGuard from "../../hooks/useAuthGuard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBullhorn } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  useAuthGuard();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("tweets");
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
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file)); // ✅ Affichage temporaire immédiat

      // ✅ Upload & mise à jour de l'avatar
      const updatedProfile = await changeAvatar(file);
      console.log("✅ Profil mis à jour :", updatedProfile);

      if (updatedProfile) {
        setProfile(prevProfile => ({
          ...prevProfile, // 🔥 Garde tous les autres champs
          avatar: updatedProfile.avatar // 🔥 Met à jour seulement l'avatar
        }));
      }
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewBanner(URL.createObjectURL(file)); // ✅ Affichage temporaire immédiat

      // ✅ Upload & mise à jour de la bannière
      const updatedProfile = await changeBanner(file);
      console.log("✅ Profil mis à jour :", updatedProfile);

      if (updatedProfile) {
        setProfile(prevProfile => ({
          ...prevProfile, // 🔥 Garde tous les autres champs
          banner: updatedProfile.banner // 🔥 Met à jour seulement la bannière
        }));
      }
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
          <FontAwesomeIcon icon={faBullhorn} className="icon" /> Tweets
        </button>
        <button className={activeTab === "likes" ? "active" : ""} onClick={() => setActiveTab("likes")}>
          <FontAwesomeIcon icon={faHeart} className="icon" /> Likes
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
