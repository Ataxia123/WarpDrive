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
    <div className="spaceship-interface spaceship-screen-display">
      <iframe className="screen-border" id="ytplayer" src="https://www.youtube.com/embed/MVPTGNGiI-4"></iframe>
    </div>
  );
};

export default SpaceshipInterface;
