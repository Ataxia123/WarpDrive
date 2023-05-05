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
  loadingProgress: number;
  response: string;
  error: string;
  interplanetaryStatusReport: string;
  buttonMessageId: string | "";
  imageUrl: string;
  srcUrl: string | null;
  loading: boolean;
  metadata: Metadata;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const MarqueePanel: React.FC<PromptPanelProps> = ({
  loading,
  loadingProgress,
  response,
  error,
  metadata,
  imageUrl,
  interplanetaryStatusReport,
}) => {
  const ethPrice = useEthPrice();
  function stringToHex(str: string): string {
    let hex = "ALLIANCEOFTHEINFINITEUNIVERSE";
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  return (
    <>
      <div className="marquee-container spaceship-display-screen">
        <h2 className="text-s font-bold marquee-title description-text">AI-U BROADCAST</h2>
        <div className="screen-border">
          <div
            style={{
              position: "relative",
              top: "0",
              left: "5%",
              width: "100%",
              height: "100%",
              zIndex: 1009000000000000000000000000000000000000000,
              display: "flex",
            }}
            className="spaceship-screen-display"
          >
            Loading:{loadingProgress}
            <br />
            {response}
          </div>
          <br />

          <p className="marquee-content" id="mc">
            {stringToHex(error ? error : metadata.Level ? metadata.Level : "")} RESPONSE------ {stringToHex(response)}{" "}
            INTERPLANETARY STATUS REPORT: {interplanetaryStatusReport} ESTABLISHING CONNECTION WITH: {metadata.Level}{" "}
            {metadata.Power1}
            {metadata.Power2} {metadata.Power3} {metadata.Power4} SCAN TO DECODE ETHEREUM PRICE IS {ethPrice}
          </p>
        </div>
      </div>
    </>
  );
};
