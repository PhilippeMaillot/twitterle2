import React, { useState, useRef, useEffect } from "react";
import "./Krok.css";
import { OPENAI_API_KEY, API_URL } from "../../api/config";
import useAuthGuard from "../../hooks/useAuthGuard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Krok = () => {
  useAuthGuard();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Référence pour scroller automatiquement en bas
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const systemMessage = {
      role: "system",
      content: "Tu es Krok, l'IA de Twitter 2, tu conseilles les gens pour faire des posts qui pourront attirer plus de monde.",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [systemMessage, ...messages.slice(-10), userMessage],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
        }),
      });

      if (!response.ok) throw new Error("Erreur de l'API");

      const data = await response.json();
      const botContent = data.choices?.[0]?.message?.content || "Je n'ai pas compris...";

      const botMessage = {
        role: "assistant",
        content: formatMessage(botContent),
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

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\d+\.\s(.+?)(?=\n\d+\.|\n\n|$)/g, "<li>$1</li>")
      .replace(/(?:\r\n|\r|\n)/g, "<br>");
  };

  return (
    <div className="krok">
      <h2><FontAwesomeIcon icon={faRobot} className="icon" /> Krok - Chat IA</h2>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p className="empty-chat">Pose-moi une question !</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === "assistant" ? (
                <p dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))
        )}
        {loading && <p className="loading">Krok réfléchit...</p>}
        <div ref={messagesEndRef} />
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
          <FontAwesomeIcon icon={faPaperPlane} className="icon" /> Envoyer
        </button>
      </div>
    </div>
  );
};

export default Krok;
