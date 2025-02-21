import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./Message.css";
import { fetchAllUsers, fetchUserConversations, fetchMessagesBetweenUsers, sendMessageAPI } from "../../api/apiCalls";
import useAuthGuard from "../../hooks/useAuthGuard";

// Connexion au WebSocket une seule fois
const socket = io("http://localhost:8081", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

const createRoomId = (userId1, userId2) => {
  const ids = [userId1, userId2].sort();
  return `${ids[0]}-${ids[1]}`;
};

const Messages = ({ currentUserId }) => {
  useAuthGuard();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      if (selectedConversation) {
        const roomId = createRoomId(currentUserId, selectedConversation);
        socket.emit("joinRoom", roomId);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion WebSocket :", error);
    });

    socket.on("newMessage", (message) => {
      const roomId = createRoomId(currentUserId, message.sender_id);
      if (selectedConversation === message.sender_id || selectedConversation === message.receiver_id) {
        setMessages(prevMessages => {
          return [...prevMessages, message];
        });
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("connect");
      socket.off("connect_error");
      if (selectedConversation) {
        const roomId = createRoomId(currentUserId, selectedConversation);
        socket.emit("leaveRoom", roomId);
      }
    };
  }, [selectedConversation, currentUserId]);


  useEffect(() => {
    const loadConversations = async () => {
      const conversationData = await fetchUserConversations();
      if (conversationData) {
        const uniqueConversations = conversationData.reduce((acc, conv) => {
          if (!acc.some(c => c.user_id === conv.user_id)) {
            acc.push(conv);
          }
          return acc;
        }, []);
        setConversations(uniqueConversations);
      }
    };

    const loadUsers = async () => {
      const usersData = await fetchAllUsers();
      if (usersData) setUsers(usersData);
    };

    loadConversations();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadMessages = async (receiverId) => {
    const messagesData = await fetchMessagesBetweenUsers(receiverId);
    setMessages(messagesData || []);
  };

  const startConversation = (user) => {
    const roomId = createRoomId(currentUserId, user.id);
    const existingConversation = conversations.find(conv => conv.user_id === user.id);

    if (!existingConversation) {
      setConversations(prevConversations => [
        { user_id: user.id, username: user.username, last_message: "" },
        ...prevConversations,
      ]);
    }

    setSelectedConversation(user.id);
    setMessages([]);
    setShowUserList(false);

    socket.emit("joinRoom", roomId);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedConversation) return;

    const messageData = await sendMessageAPI(selectedConversation, newMessage);
    if (messageData) {
      setMessages(prevMessages => [...prevMessages, messageData]);

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.user_id === selectedConversation
            ? { ...conv, last_message: newMessage }
            : conv
        )
      );

      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="messages-page">
      <div className="conversations-list">
        <div className="messages-header">
          <h3>📩 Messages</h3>
          <button className="add-conversation" onClick={() => setShowUserList(!showUserList)}>+</button>
        </div>

        {showUserList && (
          <div className="user-list">
            {users.map(user => (
              <div key={user.id} className="user-item" onClick={() => startConversation(user)}>
                {user.username}
              </div>
            ))}
          </div>
        )}

        {conversations.map((conv, index) => (
          <div
            key={`${conv.user_id}-${index}`}
            className={`conversation ${selectedConversation === conv.user_id ? "active" : ""}`}
            onClick={() => {
              setSelectedConversation(conv.user_id);
              loadMessages(conv.user_id);
            }}
          >
            <p><strong>{conv.username}</strong></p>
            <p className="last-message">{conv.last_message || "Aucun message"}</p>
          </div>
        ))}
      </div>

      <div className="conversation-window">
        {selectedConversation !== null ? (
          <div className="messages-container">
            <h3>💬 Conversation avec {conversations.find(c => c.user_id === selectedConversation)?.username}</h3>
            <div className="messages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || Math.random()}
                    className={`message ${msg.sender_id === selectedConversation ? "received" : "sent"}`}
                  >
                    <p>{msg.content}</p>
                  </div>
                ))
              ) : (
                <p className="no-messages">Aucun message pour cette conversation.</p>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </div>
        ) : (
          <p className="no-conversation">Sélectionnez une conversation.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
