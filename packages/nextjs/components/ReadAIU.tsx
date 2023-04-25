import { FunctionComponent, useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

interface ReadAIUProps {
  handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
  buttonMessageId: string | "";
  engaged: boolean;
  modifiedPrompt: string;
  interplanetaryStatusReport: string;
  setWarping: (warping: boolean) => void;
  setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
  handleEngaged: (engaged: boolean) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  onMetadataReceived: (metadata: any) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  isFocused: boolean; // Add this prop
  isMinimized: boolean; // Add this prop
  onToggleMinimize: () => void; // Add this prop
  onSubmit: (type: "character" | "background") => Promise<void>;
  travelStatus: string;
}

export const ReadAIU: FunctionComponent<ReadAIUProps> = ({
  handleButtonClick,
  buttonMessageId,
  engaged: engagedProp,
  modifiedPrompt,
  interplanetaryStatusReport,
  setWarping,
  setTravelStatus,
  handleEngaged,
  travelStatus,
  onSubmit,
  onSelectedTokenIdRecieved,
  onMetadataReceived,
  onImageSrcReceived,
  onTokenIdsReceived,
  isFocused, // Destructure the isMinimized prop
  isMinimized,
  onToggleMinimize, // Destructure the onToggleMinimize prop
}) => {
  const { address } = useAccount();
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
  const [tokenIds, setTokenIds] = useState<string[] | undefined>([]);
  const [balance, setBalance] = useState<BigNumber>(ethers.BigNumber.from(0));
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();
  const provider = useProvider();
  const [metadata, setMetadata] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string>();
  const [mouseTrigger, setMouseTrigger] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(false);

  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: 15795907, // Set an appropriate starting block number
    filters: { to: address },
  });

  const fetchUserBalance = async (address: string, contract: any) => {
    if (!address || !contract) return ethers.BigNumber.from(0);
    return await contract.balanceOf(address);
  };

  const fetchOwnedTokenIds = (transferEvents: any[] | undefined) => {
    if (!transferEvents) return [];
    return transferEvents.map(event => event.args.tokenId.toString());
  };

  const updateAppState = (userBalance: BigNumber, ownedTokenIds: string[]) => {
    setBalance(userBalance);
    setTokenIds(ownedTokenIds);
    onTokenIdsReceived(ownedTokenIds);
  };

  const resetAppState = () => {
    setBalance(ethers.BigNumber.from(0));
    setTokenIds([]);
    onTokenIdsReceived([]);
    setSelectedTokenId("");
  };

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (!address || !deployedContract || !tokenIds) {
        resetAppState();
        return;
      }

      const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
      const userBalance = await fetchUserBalance(address, contract);
      const ownedTokenIds = fetchOwnedTokenIds(transferEvents);

      if (userBalance.gt(0)) {
        updateAppState(userBalance, ownedTokenIds);
      } else {
        resetAppState();
      }
    };

    fetchTokenIds();
  }, [address, mouseTrigger, transferEvents]);

  useEffect(() => {
    const fetchTokenURI = async () => {
      if (address && deployedContract && selectedTokenId) {
        const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
        const uri = await contract.tokenURI(selectedTokenId);
        setTokenURI(uri);
      }
    };

    fetchTokenURI();
  }, [address, deployedContract, selectedTokenId]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          const response = await fetch(tokenURI);
          const json = await response.json();
          setMetadata(json);
          onMetadataReceived(json); // Add this line
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
    };

    fetchMetadata();
  }, [tokenURI]);

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTokenId(e.target.value);
    onSelectedTokenIdRecieved(e.target.value); // Add this line
  };
  useEffect(() => {
    if (modifiedPrompt) {
      setEngaged(true);
    }
  }, [modifiedPrompt]);

  const handleButton = () => {
    if (travelStatus === "AcquiringTarget" && engaged === false) {
      setWarping(false);
      setEngaged(true);
      return;
    }
    if (engaged === true && travelStatus === "AcquiringTarget") {
      onSubmit("character");
      setTravelStatus("TargetAcquired");
      setWarping(true);
    } else {
      if (selectedTokenId && travelStatus === "NoTarget") {
        setTravelStatus("AcquiringTarget");
      }
    }
  };

  useEffect(() => {
    if (metadata && metadata.image) {
      const ipfsGateway = "https://ipfs.io"; // Choose a gateway
      const imageUrl = metadata.image.replace("ipfs://", `${ipfsGateway}/ipfs/`);
      setImageSrc(imageUrl);
      onImageSrcReceived(imageUrl); // Add this line
    }
  }, [metadata]);
  function stringToHex(str: string): string {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  useEffect(() => {
    const button = document.getElementById("spaceshipButton");

    if (travelStatus === "AcquiringTarget") {
      button?.classList.add("loading");
      button?.classList.remove("active");
    } else if (travelStatus === "TargetAcquired") {
      button?.classList.add("active");
      button?.classList.remove("loading");
    } else {
      button?.classList.remove("active");
      button?.classList.remove("loading");
    }
  }, [travelStatus]);

  const AvailableButtons = () => {
    const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    return (
      <div
        style={{
          display: "flexbox",

          flexDirection: "column",
          columns: 2,
          justifyContent: "space-between",
          height: "116%",
          width: "300%",
          left: "-100%",
          position: "absolute",
          top: "-10%",
          paddingLeft: "3%",
          right: "-20%",
          marginTop: "10%",
          paddingRight: "-30%",
          flexWrap: "wrap",
          whiteSpace: "nowrap",
          zIndex: 1000,
          columnGap: "100px",
        }}
        className="spaceship-button-container spaceship-display-screen"
      >
        {buttons.map(button => (
          <button
            key={button}
            className={`spaceship-button ${
              travelStatus === "TargetAcquired" ? "active" : ""
            } display-text screen-border`}
            style={{
              marginTop: "15%",
              marginBottom: "15%",
              marginLeft: "15%",
              marginRight: "5%",
              padding: button === "🔄" ? "0.5rem" : ".5rem",
              backgroundColor: button === "🔄" ? "black" : "black",
              position: "relative",
              display: "flex",
              fontSize: "1.5rem",
              width: "3.5rem",
            }}
            onClick={() => handleButtonClick(button, "character")}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className="screen-border spaceship-display-screen thefinal overflow-auto"
        style={{
          position: "absolute",
          height: "12%",
          top: "58.3%",
          width: "10.5%",
          left: "45%",
          opacity: "0.9",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          alignContent: "right",
          justifyContent: "center",
          alignItems: "center",
          padding: ".1rem",
          scale: "0.88",
          fontSize: "1rem",
        }}
      >
        <a
          style={{
            position: "absolute",
            width: "100%",
            height: "60%",
          }}
          href="https://ai-universe.io/"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              scale: "1",
            }}
            className="spaceship-display-screen"
          >
            <ul
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "90%",

                scale: "1",
              }}
            >
              <li
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "-2rem",
                  padding: "0.1rem",
                  scale: "1",
                  width: "110%",
                  top: "30%",
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                }}
              >
                AI-Universe
              </li>

              <li
                style={{
                  fontSize: "0.8rem",
                  color: "white",
                  position: "absolute",
                  top: "25%",
                  left: "11%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                {balance?.toString()} SIGNALS INC<br></br>STATUS:{engaged ? "ENGAGED" : "OFF"}
              </li>

              <br />

              <li
                style={{
                  display: "flex",
                  flexDirection: "row",
                  overflow: "show",
                  top: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "-2rem",
                  padding: "0.1rem",
                  scale: "1",
                  width: "110%",
                  height: "10rem",
                  zIndex: 1000000000000000,
                }}
              ></li>
            </ul>
          </div>
        </a>
        <RainbowKitCustomConnectButton />
      </div>
      {balance?.toNumber() !== 0 ? (
        <div onMouseEnter={() => setMouseTrigger(true)} className="toggle-minimize-button spaceship-display-screen">
          <div onMouseEnter={onToggleMinimize} onMouseLeave={onToggleMinimize} className="spaceship-display-screen">
            <div
              className="screen-border"
              style={{
                color: "Black",
                backgroundColor: "Black",
                opacity: "0.8",
              }}
            >
              <div className="display-text hex-prompt">SIGNALS DETECTED</div>
              <br />
              <select
                id="tokenId"
                value={selectedTokenId}
                onChange={handleTokenIdChange}
                className=" dropdown-container hex-prompt dropdown-option"
                style={{
                  color: "green",
                  alignContent: "center",
                  top: "70%",
                  left: "11%",
                }}
              >
                <option value="hex-prompt dropdown-option">-ID-</option>
                {tokenIds?.map(tokenId => (
                  <option key={tokenId} value={tokenId}>
                    {tokenId}
                  </option>
                ))}
              </select>
              <button
                id="spaceshipButton"
                className="spaceship-display-screen hex-data master-button"
                onClick={() => handleButton()}
              >
                {stringToHex(metadata ? metadata.description : "No Metadata")}
              </button>
            </div>
          </div>
          {buttonMessageId !== "" && travelStatus !== "NoTarget" ? <AvailableButtons /> : <div></div>}
        </div>
      ) : (
        <div
          style={{ color: "Black", backgroundColor: "Black", opacity: "0.8", pointerEvents: "none" }}
          className="toggle-minimize-button spaceship-display-screen"
        ></div>
      )}
      <img
        style={{
          position: "absolute",
          height: "25%",
          width: "19%",
          top: "20.4%",
          left: "40.96%",
          opacity: "0.15",
          zIndex: "1000000",
        }}
        src="/aiu.png"
        onClick={() => {
          setEngaged(!engaged);
        }}
      ></img>{" "}
      <div className={`spaceship-display-screen token-selection-panel${!isMinimized && engaged ? "-focused" : ""}`}>
        <div
          style={{
            color: "Black",
            position: "relative",

            opacity: "1",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              height: "40%",
              width: "100%",
              top: "20%",
              display: "flex",
              flexDirection: "row",
            }}
            className="spaceship-display-screen"
          >
            <div
              className="spaceship-display-screen"
              style={{ position: "relative", top: "-35%", height: "50%", width: "50%" }}
            >
              <div
                style={{
                  left: "30%",
                  marginLeft: "-23%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  top: "10%",
                  position: "absolute",
                  width: "100%",
                  height: "20%",
                }}
                className="display-text hex-prompt"
              >
                {travelStatus}
              </div>
              <div
                className="prompt-display"
                style={{
                  position: "absolute",
                  left: "-15%",
                  marginLeft: "45%",
                  display: "flex",
                  marginRight: "2180rem",
                  right: "100%",
                  padding: "1rem",
                  flexDirection: "row",
                  justifyContent: "center",
                  top: "50%",
                  width: "60%",
                  height: "20%",
                  fontSize: ".7rem",
                  wordBreak: "break-all",
                }}
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    left: "15%",
                    color: "white",
                    top: "-130%",
                    fontWeight: "bold",
                  }}
                  className="description-text"
                >
                  MODIFIED SIGNAL:
                </div>
              </div>
              <div
                className="hex-data-revealer scroll-text"
                style={{
                  width: "50%",
                  height: "50%",
                  scale: "1.2",
                  top: "55%",
                  left: "35%",
                }}
              >
                {stringToHex(modifiedPrompt ? modifiedPrompt : "No SIGNAL")}
              </div>
              <br />
              <p
                className="hex-display hex-prompt"
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: "1rem",
                  paddingRight: "2rem",
                  left: "25%",
                  width: "70%",
                  color: "white",
                  top: "40%",
                  wordBreak: "break-all",
                  height: "50%",
                  fontSize: ".7rem",
                  overflowY: "auto",
                  zIndex: 10000,
                }}
              >
                {" "}
                {modifiedPrompt}
              </p>
              <br />
              Attributes:
              <h3
                style={{
                  position: "relative",
                  left: "5%",
                  top: "45%",
                  width: "150%",
                  height: "170%",
                }}
                className="description-text attributes spaceship-display-screen"
              >
                <div
                  style={{
                    position: "relative",
                    left: "-15%",
                    top: "0%",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {metadata?.attributes[1].value}
                  {""}
                  {metadata?.attributes[2].value} {""}
                  {metadata?.attributes[3].value} {""}
                </div>
                <div
                  style={{
                    right: "70%",
                    left: "-4%",
                    top: "23%",
                    marginLeft: "20%",
                    marginTop: "-8%",
                    height: "100%",
                    width: "40%",
                    bottom: "-30%",
                    opacity: "1",
                    zIndex: "10000",
                    position: "relative",
                  }}
                  className="hex-data-revealer hover: hover:opacity-10"
                >
                  {" "}
                  {stringToHex(metadata ? metadata.description : "No Metadata")}
                  {metadata?.attributes[4].value}{" "}
                </div>{" "}
                <ul
                  className=""
                  style={{
                    position: "absolute",
                    padding: "1rem",

                    color: "white",
                    justifyContent: "center",
                    left: "13%",
                    top: "6%",
                    width: "100%",
                    height: "90%",
                    marginTop: "-10%",
                    marginLeft: "5%",
                    marginRight: "5%",
                    marginBottom: "5%",
                    fontSize: ".7rem",
                    overflowY: "auto",
                    zIndex: 10000,
                  }}
                >
                  {metadata?.attributes.map((attribute: any, index: number) => (
                    <li
                      className="hex-prompt spaceship-button-text"
                      style={{
                        color: "white",
                        fontSize: ".7rem",
                        textAlign: "center",
                        top: "30%",
                        textEmphasisColor: "white",
                        fontWeight: "bold",

                        position: "relative",

                        width: "30%",
                      }}
                      key={index}
                    >
                      {attribute.trait_type}: {attribute.value}
                    </li>
                  ))}
                </ul>
              </h3>
              <br />
            </div>
            <div
              className="spaceship-display-screen"
              style={{
                bottom: "50%",
                top: "43%",
                position: "relative",
                height: "140%",
                width: "50%",
                display: "flex",
                paddingTop: "11rem",
                paddingRight: "4rem",
                marginRight: "0rem",
                marginLeft: "-1rem",
              }}
            >
              <div
                className=""
                style={{
                  color: "white",
                  padding: "1rem",
                  zIndex: 100000000000000000000000000000,
                  position: "absolute",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  top: "0%",
                }}
              >
                INTERPLANETARY STATUS REPORT
                <h2
                  className="scroll-text"
                  style={{
                    alignContent: "center",
                    left: "0%",
                    top: "-10%",
                    height: "60%",
                    width: "90%",
                    position: "relative",
                    marginBottom: "17rem",
                    fontSize: "0.9rem",
                    zIndex: 111111111111111,
                  }}
                >
                  {interplanetaryStatusReport}
                </h2>
              </div>
              <div
                style={{
                  zIndex: 11111111111111,
                }}
                className="hex-data"
              >
                {" "}
                {stringToHex(metadata ? metadata.description : "No Metadata")}
              </div>
            </div>
            <img
              style={{
                borderRadius: "50%",
                position: "absolute",
                height: "70%",
                width: "28%",
                top: "-45%",
                left: "37%",
                border: "12px solid #000000",
                zIndex: 10000100,
              }}
              src={imageSrc}
            ></img>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
