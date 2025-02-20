const API_URL = "http://localhost:8081";

// Fonction pour récupérer l'utilisateur connecté
export const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Aucun token trouvé !");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Vérifie bien ce format
            },
        });

        if (!response.ok) {
            console.error("Erreur API:", response.status);
            throw new Error("Erreur lors de la récupération des données");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur réseau:", error);
        return null;
    }
};

// Fonction pour s'inscrire
export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur réseau:", error);
        return null;
    }
};

// Fonction pour se connecter
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur réseau:", error);
        return null;
    }
};

// Fonction pour se déconnecter
export const logoutUser = () => {
    localStorage.removeItem("token");
};

export const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("✅ Image uploadée :", data.imageUrl);
      } else {
        console.error("❌ Erreur d'upload :", data.error);
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };

  export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des posts :", error);
        return [];
    }
};

export const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Aucun token trouvé !");
        return null;
    }

    try {
        const response = await fetch("http://localhost:8081/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("❌ Erreur API:", response.status);
            throw new Error("Erreur lors de la récupération du profil");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return null;
    }
}; 

//api call pour ajouter un like à un post on va envoyer le token, l'id du post dans le body de la requête
export const likePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Aucun token trouvé !");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ post_id: postId }),
        });

        if (!response.ok) {
            console.error("❌ Erreur API:", response.status);
            throw new Error("Erreur lors de l'ajout du like");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return null;
    }
}

export const fetchLikedPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Aucun token trouvé !");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/posts/byUser`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("❌ Erreur API:", response.status);
            throw new Error("Erreur lors de la récupération des likes");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return null;
    }
};

export const unlikePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Aucun token trouvé !");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/likes/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("❌ Erreur API:", response.status);
            throw new Error("Erreur lors de la suppression du like");
        }

        return true; // Retourne `true` en cas de succès
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return false; // Retourne `false` en cas d'échec
    }
};

export const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        return [];
    }
};

export const fetchMessagesBetweenUsers = async (receiverId) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const response = await fetch(`http://localhost:8081/messages/conversation/${receiverId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Erreur lors de la récupération des messages");
  
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      return [];
    }
  };
  
  export const sendMessageAPI = async (receiverId, content) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const response = await fetch(`http://localhost:8081/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId, content }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      return null;
    }
  };

  export const fetchUserConversations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch(`http://localhost:8081/messages/conversations`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des conversations");

        return await response.json();
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return [];
    }
};

  

