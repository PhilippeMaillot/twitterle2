import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Profile from "./pages/profiles/Profile";
import Messages from "./pages/messages/Message";
import Krok from "./pages/krok/Krok";
import Auth from "./pages/auth/Auth";
import Parametre from "./pages/parametres/Parametre";

import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="krok" element={<Krok />} />
          <Route path="settings" element={<Parametre />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
