import React from "react";
import styles from "./styles.module.css";

const RoundGifContainer = ({ gifSrc, altText }) => {
  const containerStyle = {
    borderRadius: "2%", // Makes the container round
    overflow: "hidden", // Ensures the GIF stays within the round container
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #ccc", // Optional: Adds a border
    boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)", // Optional: Adds a shadow
    backgroundColor: "#000", // Optional: Background color for better contrast
  };

  const gifStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensures the GIF covers the container without distortion
  };

  return (
    <div className={styles.ottoMainDisplay}>
      <img src={gifSrc} alt={altText} style={gifStyle} />
    </div>
  );
};

export default RoundGifContainer;
