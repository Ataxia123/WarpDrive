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
    <div>
      <iframe
        className="spaceship-interface unfocused-synthboy scale-100 transition-all duration-300"
        id="ytplayer"
        width="72"
        height="40"
        src="https://www.youtube.com/embed/MVPTGNGiI-4"
      ></iframe>
    </div>
  );
};

export default SpaceshipInterface;
