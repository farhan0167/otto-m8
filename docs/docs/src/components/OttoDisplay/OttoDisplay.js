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
    width: "1000px",
    height: "600px",
    objectFit: "cover", // Ensures the GIF covers the container without distortion
  };

  return (
    <div className={styles.ottoMainDisplay}>
      <iframe style={gifStyle} src="https://www.youtube.com/embed/W2arxlYvZdU?si=BDmoaNJQr9H63tKI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
  );
};

export default RoundGifContainer;
