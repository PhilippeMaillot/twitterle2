"use client";

import React, { useState, useEffect } from "react";
import "./TweetCard.css";
import { likePost, unlikePost, fetchLikedPosts, fetchUserData } from "../../api/apiCalls"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons"; 

const TweetCard = ({ post, onDelete }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await fetchUserData();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const checkUserLikedPosts = async () => {
      try {
        const likedPosts = await fetchLikedPosts();
        if (likedPosts && Array.isArray(likedPosts)) {
          const isLiked = likedPosts.some((likedPost) => likedPost.post_id === post.id);
          setLiked(isLiked);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des likes :", error);
      }
    };

    checkUserLikedPosts();
  }, [post.id]);

  const openImageFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeImageFullscreen = () => {
    setFullscreenImage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = async () => {
    if (liked) {
      const success = await unlikePost(post.id);
      if (success) {
        setLikes((prev) => prev - 1);
        setLiked(false);
      }
    } else {
      const success = await likePost(post.id);
      if (success) {
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    }
  };

  // ✅ Supprime instantanément le tweet de l'affichage AVANT la requête API
  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) {
      onDelete(post.id); // ✅ Retirer immédiatement le tweet de l'affichage

      try {
        const response = await fetch(`http://localhost:8081/posts/${post.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du tweet");
        }

        console.log("✅ Tweet supprimé !");
      } catch (error) {
        console.error("❌ Erreur réseau :", error);
        alert("Erreur lors de la suppression du tweet. Essayez à nouveau.");
      }
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-header-left">
          <img
            src={post.avatar ? `http://localhost:8081/uploads/${post.avatar}` : "/default-avatar.png"}
            alt="Avatar"
            className="avatar"
          />
          <div className="post-user-info">
            <h3 className="username">{post.username}</h3>
            <h5 className="display-name">{post.display_name}</h5>
          </div>
        </div>
        <span className="post-date">{formatDate(post.created_at)}</span>

        {/* ✅ Bouton de suppression visible seulement si l'utilisateur est l'auteur */}
        {currentUser && currentUser.id === post.user_id && (
          <button className="delete-button" onClick={handleDeletePost}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>

      <p>{post.content}</p>

      {post.image && (
        <img
          src={`http://localhost:8081/uploads/${post.image}`}
          alt="Tweet"
          className="tweet-image"
          onClick={() => openImageFullscreen(`http://localhost:8081/uploads/${post.image}`)}
        />
      )}

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeImageFullscreen}>
          <button className="close-overlay" onClick={closeImageFullscreen}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <img src={fullscreenImage} alt="Tweet en grand format" className="fullscreen-image" />
        </div>
      )}

      <div className="actions">
        <button onClick={handleLike} className={liked ? "liked" : ""}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className="heart-icon" /> {likes}
        </button>
      </div>
    </div>
  );
};

export default TweetCard;
