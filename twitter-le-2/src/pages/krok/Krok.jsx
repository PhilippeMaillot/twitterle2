import React, { useState } from "react";
import "./Krok.css";
import { OPENAI_API_KEY, API_URL } from "../../api/config";

const Krok = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
          temperature: 0.7, // Ajuste la créativité des réponses
          max_tokens: 500, // Limite la longueur de la réponse
          top_p: 1,
        }),
      });

      if (!response.ok) throw new Error("Erreur de l'API");

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "Je n'ai pas compris...",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur API AIML:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur est survenue." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="krok">
      <h2>🤖 Krok - Chat IA</h2>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p className="empty-chat">Pose-moi une question !</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))
        )}
        {loading && <p className="loading">Krok réfléchit...</p>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Krok;
