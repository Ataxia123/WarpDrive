import React, { useState } from "react";

// Import the CSS styles

const SpaceshipInterface = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoId = "MVPTGNGiI-4"; // Fix the videoId

  const toggleVideo = () => {
    setVideoPlaying(!videoPlaying);
  };

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${videoPlaying ? "1" : "0"}&mute=1`;

  return (
    <div className=" spaceship-screen-display">
      <iframe
        className="screen-border spaceship-interface"
        id="ytplayer"
        src="https://www.youtube.com/embed/MVPTGNGiI-4?autoplay=1&mute=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
};

export default SpaceshipInterface;
