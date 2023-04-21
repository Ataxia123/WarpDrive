import { useState } from "react";
import { useEthPrice } from "~~/hooks/scaffold-eth";

type Metadata = {
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
};

interface PromptPanelProps {
  buttonMessageId: string | "";
  imageUrl: string;
  srcUrl: string | undefined;
  loading: boolean;
  metadata: Metadata;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const MarqueePanel: React.FC<PromptPanelProps> = ({ metadata, imageUrl }) => {
  const ethPrice = useEthPrice();
  return (
    <>
      <div className="marquee-container spaceship-display-screen">
        <h2 className="text-s font-bold marquee-title description-text">AI-U BROADCAST</h2>
        <div className="screen-border">
          <br />

          <p className="marquee-content">
            ESTABLISHING CONNECTION WITH: {metadata.Level} {metadata.Power1} {metadata.Power2} {metadata.Power3}{" "}
            {metadata.Power4} SCAN TO DECODE ETHEREUM PRICE IS {ethPrice}
          </p>
        </div>
      </div>
    </>
  );
};
