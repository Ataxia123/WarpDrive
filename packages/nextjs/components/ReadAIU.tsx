import { FunctionComponent, useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

interface ReadAIUProps {
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
    if (travelStatus === "ready") {
      setEngaged(false);
    }
  }, [travelStatus]);

  const handleButton = () => {
    if (travelStatus === "TargetAcquired") {
      setEngaged(true);
      setWarping(true);
      handleEngaged(true);
    } else if (engaged === true) {
      onSubmit("character");
      setEngaged(false);
    } else {
      if (selectedTokenId) {
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
      button?.classList.add("active");
      button?.classList.remove("loading");
    } else if (travelStatus === "TargetAcquired") {
      button?.classList.add("loading");
      button?.classList.remove("active");
    } else {
      button?.classList.remove("active");
      button?.classList.remove("loading");
    }
  }, [travelStatus]);

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
          padding: "1rem",
          scale: "0.98",
          fontSize: "1.5rem",
        }}
      >
        {balance?.toString()} SIGNALS DETECTED
        <br />
        <div>ENGAGED{engaged}</div>
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
              <p className="display-text hex-prompt">SIGNALS DETECTED</p>
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
                    {selectedTokenId}
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
        </div>
      ) : (
        <div
          style={{ color: "Black", backgroundColor: "Black", opacity: "0.8", pointerEvents: "none" }}
          className="toggle-minimize-button spaceship-display-screen"
        ></div>
      )}
      <div className={`spaceship-display-screen token-selection-panel${isMinimized ? "-focused" : ""}`}>
        <div className="screen-border">
          {metadata && (
            <>
              <div className="panel-content">
                {imageSrc && (
                  <div className="image-column">
                    <img
                      className="focused-image-display"
                      src={imageSrc}
                      alt={metadata?.name}
                      style={{
                        position: "absolute",
                        padding: "5rem",
                        paddingRight: "2rem",
                        marginLeft: "10%",
                        top: "-30%",
                        bottom: "10%",
                        left: "-12%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div
                  className="text-column screen-border"
                  style={{
                    position: "relative",
                    textAlign: "center",
                    padding: "10rem",
                    paddingRight: "6rem",
                    content: "fit-content",
                    bottom: "20%",
                    maxHeight: "50%",
                    maxWidth: "90%",
                    marginLeft: "-2.5rem",
                    marginRight: "12rem",
                    marginBottom: "-44rem",
                    marginTop: "-7rem",
                    height: "60rem",
                  }}
                >
                  {" "}
                  <h2>
                    <h3
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      WELCOME TO THE FINAL FRONTIER -------------------------------
                      <br />
                      {interplanetaryStatusReport ? interplanetaryStatusReport : "No Status Report"}
                    </h3>
                    Attributes:
                    <h3 className="description-text">
                      {metadata?.attributes[1].value}
                      {""}
                      {metadata?.attributes[2].value} {""}
                      {metadata?.attributes[3].value} {""}
                      {metadata?.attributes[4].value}
                      {stringToHex(metadata ? metadata.description : "No Metadata")}
                      <ul>
                        {metadata.attributes.map((attribute: any, index: number) => (
                          <li key={index}>
                            {attribute.trait_type}: {attribute.value}
                          </li>
                        ))}
                      </ul>
                    </h3>
                  </h2>
                </div>
              </div>
            </>
          )}

          <h3 className="panel-title focused-title description-text position-relative">
            <div className="panel-content justify-center"></div>
          </h3>
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
