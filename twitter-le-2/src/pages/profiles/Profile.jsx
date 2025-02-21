"use client";

import React, { useState, useEffect } from "react";
import "./Profile.css";
import { fetchUserProfile } from "../../api/apiCalls";
import { changeAvatar, changeBanner } from "../../api/apiCalls";
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));

      const updatedProfile = await changeAvatar(file);
      if (updatedProfile) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: updatedProfile.avatar,
        }));
      }
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewBanner(URL.createObjectURL(file));

      const updatedProfile = await changeBanner(file);
      if (updatedProfile) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          banner: updatedProfile.banner,
        }));
      }
    }
  };

  const handleDeleteTweet = (tweetId) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      tweets: prevProfile.tweets.filter((tweet) => tweet.id !== tweetId),
    }));
  };

  return (
    <div className="profile">
      {/* Bannière */}
      <div className="banner">
        <label htmlFor="banner-upload">
          <img
            src={
              previewBanner ||
              (profile.banner
                ? `http://localhost:8081/uploads/${profile.banner}`
                : "http://localhost:8081/uploads/base_banner.jpg")
            }
            alt="Bannière du profil"
            className="clickable-image"
          />
        </label>
        <input
          type="file"
          id="banner-upload"
          accept="image/*"
          onChange={handleBannerChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="profile-header">
        <label htmlFor="avatar-upload">
          <img
            className="avatar clickable-image"
            src={
              previewAvatar ||
              (profile.avatar
                ? `http://localhost:8081/uploads/${profile.avatar}`
                : "http://localhost:8081/uploads/base_avatar.png")
            }
            alt="Photo de profil"
          />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />

        <div className="user-info">
          <h2>{profile.username}</h2>
          <p>{profile.display_name}</p>
          <p className="bio">{profile.bio}</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "tweets" ? "active" : ""}
          onClick={() => setActiveTab("tweets")}
        >
          <FontAwesomeIcon icon={faBullhorn} className="icon" /> Tweets
        </button>
        <button
          className={activeTab === "likes" ? "active" : ""}
          onClick={() => setActiveTab("likes")}
        >
          <FontAwesomeIcon icon={faHeart} className="icon" /> Likes
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "tweets" ? (
          <div className="tweets-section">
            {profile.tweets.length > 0 ? (
              profile.tweets.map((tweet) => (
                <TweetCard key={tweet.id} post={tweet} onDelete={handleDeleteTweet} />
              ))
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
