import React, { useState } from "react";

// Import the CSS styles

const SpaceshipInterface = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoId = "MVPTGNGiI-4"; // Fix the videoId

  const toggleVideo = () => {
    setVideoPlaying(!videoPlaying);
  };
  const divStyle: React.CSSProperties = {
    pointerEvents: videoPlaying ? "auto" : "none",
    opacity: videoPlaying ? 0.3 : 1,
  };

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${videoPlaying ? "1" : "0"}&mute=0`;

  return (
    <>
      <div style={divStyle} className="spaceship-screen-display" onClick={toggleVideo}>
        <iframe
          className={`screen-border spaceship-interface ${videoPlaying ? "video-playing" : ""}`}
          id="ytplayer"
          src={iframeSrc}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <div
        className="screen-border spaceship-pannel spaceship-display-screen"
        style={{
          position: "absolute",
          height: "10%",
          width: "5%",

          fontSize: ".8rem",
          display: "flex",
          justifyContent: "center",
          border: "1px solid #fff",
          alignItems: "center",
          top: "62%",
          left: "63%",
          marginRight: "5%",
          padding: "1.5rem",
          zIndex: 1,
          transform: "rotateZ(10deg) rotateY(-30deg)skewX(5deg)skewY(-3deg)",
          animation: "pulse 15s infinite",
        }}
      >
        <button
          onClick={toggleVideo}
          className=""
          style={{
            background: "transparent",
            border: "none",
            opacity: 1,

            fontSize: "0.9rem",
            pointerEvents: "auto",
          }}
        >
          SPACE RADIO<br></br>
          {videoPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </>
  );
};

export default SpaceshipInterface;
