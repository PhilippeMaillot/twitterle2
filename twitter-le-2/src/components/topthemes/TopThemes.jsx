import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import "./TopThemes.css";

const TopThemes = ({ topThemes }) => {
  return (
    <div className="top-themes">
      <h3>
        <FontAwesomeIcon icon={faFire} className="icon" /> Top actus
      </h3>
      {topThemes.length === 0 ? (
        <p>Analyse en cours...</p>
      ) : (
        <ul>
          {topThemes.map((theme, index) => (
            <li key={index}>{theme}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopThemes;
