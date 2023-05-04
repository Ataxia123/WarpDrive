import { FunctionComponent, useCallback, useEffect, useState } from "react";
import AudioController from "../components/AudioController";
import { BigNumber, Contract, ethers } from "ethers";
import { wrap } from "module";
import { useAccount, useProvider } from "wagmi";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

type Metadata = {
  srcUrl: string | undefined;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
  scannerOutput: string[];
};
interface ReadAIUProps {
  parsedMetadata: Metadata;
  warping: boolean;
  scannerOutput: any;
  playSpaceshipOn: () => void;
  handleScanning: (scanning: boolean) => void;
  scanning: boolean;
  handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
  buttonMessageId: string | "";
  engaged: boolean;
  modifiedPrompt: string;
  interplanetaryStatusReport: string;
  playWarpSpeed: () => void;
  playHolographicDisplay: () => void;
  playSpaceshipHum: () => void;
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
  parsedMetadata,
  warping,
  scannerOutput,
  playSpaceshipOn,
  playWarpSpeed,
  playHolographicDisplay,
  playSpaceshipHum,
  handleScanning,
  scanning,
  handleButtonClick,
  buttonMessageId,
  engaged: engagedProp,
  modifiedPrompt,
  interplanetaryStatusReport,

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
  const [scanOutputIndex, setScanOutputIndex] = useState<number>(0);
  const [scannerOptions, setScannerOptions] = useState<string[]>([
    "abilities",
    "healthAndStatus",
    "equipment",
    "funFact",
  ]);

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

  const handlePrevious = () => {
    if (scanOutputIndex > 0) {
      setScanOutputIndex(scanOutputIndex - 1);
    }
  };

  const handleNext = () => {
    if (scanOutputIndex < scannerOptions.length - 1) {
      setScanOutputIndex(scanOutputIndex + 1);
    }
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
    playSpaceshipOn();
    onSelectedTokenIdRecieved(e.target.value); // Add this line
  };
  useEffect(() => {
    if (modifiedPrompt) {
      setEngaged(true);
    }
  }, [modifiedPrompt]);
  //the important function
  const handleButton = () => {
    playHolographicDisplay();
    if (travelStatus === "AcquiringTarget" && scanning === false) {
      playWarpSpeed();
      try {
        setTimeout(() => {
          onSubmit("character");
          setTravelStatus("TargetAcquired");
        }, 2100);
      } catch (error) {
        setTravelStatus("NoTarget");
        console.log(error);
      }
    } else if (travelStatus === "AcquiringTarget" && scanning === true) {
      playWarpSpeed();
      try {
        setTimeout(() => {
          handleScanning(false);
        }, 2100);
      } catch (error) {
        setTravelStatus("NoTarget");
        console.log(error);
      }
    } else {
      if (selectedTokenId && travelStatus === "NoTarget") {
        setTravelStatus("AcquiringTarget");
        playSpaceshipHum();
        setEngaged(true);
      } else {
        setTravelStatus("NoTarget");
        setEngaged(false);
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
            onClick={() => {
              playWarpSpeed();
              try {
                setTimeout(() => {
                  handleButtonClick(button, "character");
                }, 2100);
              } catch (error) {
                setTravelStatus("NoTarget");
                console.log(error);
              }
            }}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {" "}
      <div
        className="spaceship-display-screen thefinal overflow-auto screen-border "
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
        {" "}
        <a
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "-2%",
            left: "5%",
            zIndex: 10000000000001000000000000000000,
            pointerEvents: "auto",
          }}
          href="https://ai-universe.io/"
        >
          <div>AI-Universe</div>
        </a>{" "}
        <span
          style={{
            height: "50%",
            width: "100%",
            position: "absolute",
            top: "-10%",
            left: "-5%",
            zIndex: 1000000000000000,
            fontSize: "0.8rem",
            padding: ".2rem",
            paddingLeft: "0.5rem",
            fontWeight: "bold",
          }}
        >
          <RainbowKitCustomConnectButton />
        </span>{" "}
        <ul
          style={{
            marginTop: "40%",
            top: "35%",
            padding: "1.5rem",
            fontSize: "0.8rem",
            scale: "0.88",
          }}
        >
          <li
            style={{
              padding: "0.3rem",
            }}
            className="display-text hex-prompt"
          >
            {" "}
            SIGNALS INC:
            <span
              style={{
                color: "white",
              }}
            >
              {" "}
              {balance?.toString()}
            </span>{" "}
          </li>
          <li style={{}}> </li>{" "}
          <li
            style={{
              alignContent: "left",
              justifyItems: "left",
              padding: "0.1rem",
              fontSize: "0.8rem",
              fontWeight: "bold",

              color: "white",

              overflow: "show",

              width: "50%",
            }}
          >
            {" "}
            {scanning === true ? (
              <>
                {" "}
                SCANNING:<span style={{ color: "yellow" }}>TRUE</span>{" "}
              </>
            ) : (
              <>
                {" "}
                SCANNING:<span style={{ color: "red" }}>FALSE</span>{" "}
              </>
            )}{" "}
            {engaged === true ? (
              <>
                {" "}
                ENGAGED:<span style={{ color: "yellow" }}>TRUE</span>{" "}
              </>
            ) : (
              <>
                {" "}
                ENGAGED:<span style={{ color: "red" }}>FALSE</span>{" "}
              </>
            )}{" "}
            {warping === true ? (
              <>
                {" "}
                WARPING:<span style={{ color: "yellow" }}>TRUE</span>{" "}
              </>
            ) : (
              <>
                {" "}
                WARPING:<span style={{ color: "red" }}>FALSE</span>{" "}
              </>
            )}
          </li>
        </ul>
        <br />
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
              {selectedTokenId && travelStatus == "NoTarget" ? (
                <div
                  style={{
                    fontWeight: "bold",

                    fontSize: "1rem",
                    position: "absolute",
                    top: "20%",
                    height: "30%",
                    width: "100%",
                    padding: "0.1rem",
                    marginTop: "-2rem",
                    color: "white",
                  }}
                  className="description-text hex-prompt"
                  onClick={() => handleButton()}
                >
                  |N.A.V.| COMPUTER
                  <br />
                  READY
                </div>
              ) : (
                travelStatus == "AcquiringTarget" && (
                  <div
                    style={{
                      fontWeight: "bold",

                      fontSize: "1rem",
                      position: "absolute",
                      top: "20%",
                      height: "30%",
                      width: "100%",
                      padding: "0.1rem",
                      marginTop: "-2rem",
                      color: "white",
                    }}
                    className="description-text hex-prompt"
                    onClick={() => handleButton()}
                  >
                    ENGAGE WARP DRIVE{" "}
                  </div>
                )
              )}
              {!selectedTokenId && (
                <div
                  style={{
                    fontWeight: "bold",

                    fontSize: "1rem",
                    position: "absolute",
                    top: "11%",
                    height: "20%",
                    width: "100%",
                    padding: "0.1rem",
                    marginTop: "-2rem",
                  }}
                  className="display-text hex-prompt"
                >
                  SELECT ID
                </div>
              )}
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
          zIndex: 1000000,
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
              width: "22.5%",
              height: "40.5%",
              left: "5%",
              top: "19%",
              position: "absolute",
              zIndex: 1000000000000000,
              fontSize: ".91rem",
              padding: ".3rem",
              paddingBottom: "0.1rem",
              paddingLeft: "0.8rem",
              fontWeight: "bold",
            }}
            className="spaceship-display-screen"
          >
            <li
              style={{
                padding: "1.4rem",
                paddingLeft: "4.2rem",
                marginBottom: "1rem",
                marginTop: "-1rem",
                marginLeft: "2.1rem",
                font: "Orbitron",
                fontSize: ".70rem",
              }}
            >
              {metadata?.name} METADATA
            </li>{" "}
            <ul
              style={{
                position: "absolute",
                padding: "1.5rem",
                paddingTop: "-0.001rem",
                paddingLeft: "2.8rem",
                width: "120%",
                top: "25%",
                left: "-12.5%",
                scale: "0.9",
              }}
              className="spaceship-display-screen"
            >
              <br /> Type:{" "}
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "0.8rem",
                }}
              >
                {parsedMetadata?.Level}
              </span>
              <br />
              Power1:{" "}
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "0.8rem",
                }}
              >
                {parsedMetadata?.Power1}
              </span>
              <br />
              Power2:{" "}
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "0.8rem",
                }}
              >
                {parsedMetadata?.Power2}
              </span>
              <br />
              Power3:{" "}
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "0.8rem",
                }}
              >
                {parsedMetadata?.Power3}
              </span>
              <br />
              Side:{" "}
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "0.1rem",
                }}
              >
                {parsedMetadata?.Side}
              </span>
              <br />
              Allignment:
              <br />
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: "1.5rem",
                }}
              >
                {parsedMetadata?.Alignment1} {parsedMetadata?.Alignment2}
              </span>
            </ul>
          </div>{" "}
          <div
            style={{
              position: "absolute",
              height: "40%",
              width: "100%",
              top: "20%",
              left: "0%",
              display: "flex",
              flexDirection: "row",
            }}
            className="spaceship-display-screen"
          >
            <div
              className="spaceship-display-screen"
              style={{
                bottom: "60%",
                top: "-3%",
                left: "29%",
                position: "relative",
                height: "100%",
                width: "70%",
                display: "flex",
                paddingTop: "11rem",
                paddingRight: "4rem",
                marginRight: "0rem",
                marginLeft: "-1rem",
                pointerEvents: "auto",
              }}
            >
              <div
                className=""
                style={{
                  color: "white",
                  padding: "1.2rem",
                  zIndex: 10000000000000000000,
                  position: "absolute",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  height: "82%",
                  top: "20%",
                  width: "73.8%",
                  left: "-2%",
                }}
              >
                INTERPLANETARY STATUS REPORT
                <div
                  style={{
                    color: "black",
                    paddingLeft: "3.1rem",
                    zIndex: 10000000000000000000,
                    position: "relative",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    height: "95%",
                    overflowX: "hidden",
                    overflowY: "scroll",
                  }}
                  className="spaceship-display-screen"
                >
                  <div>
                    {engaged === false ? (
                      <> #---ENGAGE to ANALYZE---#</>
                    ) : (
                      <>
                        {" "}
                        {selectedTokenId == "" ? (
                          <> #SELECT TOKEN to DECODE#</>
                        ) : (
                          <>
                            {travelStatus === "NoTarget" ? (
                              <> #ENABLE N.A.V. COMPUTER#</>
                            ) : (
                              <>
                                {" "}
                                {interplanetaryStatusReport !== "" ? (
                                  <>
                                    {" "}
                                    |------ENGAGE SCANNER------|
                                    <br />
                                    |----------TO OBTAIN-----------|
                                    <br />| -INTERPLANETARY REPORT-|
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <span
                                      style={{
                                        position: "relative",
                                        marginLeft: "-5%",
                                        left: "17%",
                                        bottom: "10%",
                                      }}
                                      className="spaceship-display-screen"
                                    >
                                      TRANSMISSION FROM:
                                      <br />
                                      <br />
                                      {parsedMetadata?.Level} {parsedMetadata?.Power1} {parsedMetadata?.Power2}
                                    </span>{" "}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <br />
                    <br />
                    <br />
                  </div>

                  <p
                    className=" prompt-data"
                    style={{
                      position: "relative",
                      fontSize: "0.8rem",
                      fontWeight: "normal",
                      color: "white",

                      justifyContent: "center",
                      alignItems: "center",
                      display: "flexbox",
                      flexDirection: "column",

                      zIndex: 10000000000000010000000000000000000000000000000000000000000000,

                      top: "0.3rem",
                      padding: "1rem",
                      left: "-10.2%",
                      height: "100%",
                      width: "110%",

                      pointerEvents: "auto",
                    }}
                  >
                    {scannerOutput?.funFact ? (
                      <span
                        className="spaceship-display-screen"
                        style={{
                          position: "relative",

                          top: "1rem",
                          left: "-0.3rem",
                          width: "110%",
                          height: "110%",
                          paddingLeft: "0rem",
                          paddingRight: ".8rem",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          color: "white",
                          paddingTop: "0rem",
                        }}
                      >
                        <br /> FUN FACT: <br />
                        <br />
                        {scannerOutput.funFact}
                      </span>
                    ) : (
                      <span
                        style={{
                          position: "absolute",

                          marginLeft: "26%",
                          width: "40%",
                          marginRight: "22%",
                          height: "0%",
                          top: "0%",
                          paddingLeft: "1.2rem",
                          marginBottom: "20%",

                          fontSize: "0.8rem",
                          fontWeight: "normal",
                        }}
                        className="spaceship-display-screen"
                      >
                        ENGAGE N.A.V. COMPUTER TO DECODE DATA
                        <br />
                      </span>
                    )}
                    <br />
                  </p>
                </div>
              </div>
              <div
                style={{
                  zIndex: -11111,
                }}
                className="hex-data"
              >
                <div
                  className="spaceship-display-screen"
                  style={{
                    position: "absolute",
                    top: "17%",
                    left: "68.2%",
                    height: "85%",
                    width: "35%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  {" "}
                  <div
                    style={{
                      position: "absolute",
                      top: "2%",
                      left: "27%",
                      fontSize: "1.2rem",
                      pointerEvents: "auto",
                      zIndex: 10000000,
                    }}
                  >
                    {" "}
                    <span onClick={() => handlePrevious}> {`<<`} </span> ||
                    <span onClick={() => handleNext}> {`>>`} </span>
                  </div>
                  <div
                    style={{
                      marginTop: "7%",
                      marginLeft: "-1rem",
                      padding: "1rem",
                      paddingRight: "3.2rem",

                      height: "90%",
                      width: "90%",
                      fontSize: "0.8rem",
                      pointerEvents: "auto",
                      overflowY: "scroll",
                    }}
                    className="hex-prompt display-border"
                  >
                    <span
                      className="spaceship-display-screen"
                      style={{
                        position: "absolute",
                        top: "1.5rem",
                        width: "60%",
                        left: "1.4rem",
                        fontSize: "0.85rem",
                        pointerEvents: "auto",
                        height: "18%",
                        lineHeight: "0.8rem",
                      }}
                    >
                      SCANNER
                      <br />
                      OUTPUT: <br />
                      {scanOutputIndex + 1}/{scannerOptions.length}
                      <br />
                    </span>{" "}
                    <span
                      className="spaceship-display-screen"
                      style={{
                        position: "absolute",
                        top: "5rem",
                        width: "85%",
                        paddingTop: ".5rem",
                        paddingInline: "0rem",
                        left: "0rem",
                        fontSize: "0.70rem",
                        lineHeight: "0.8rem",
                        pointerEvents: "auto",
                        height: "66%",
                        display: "flex",
                        padding: "0.5rem",
                        overflowY: "scroll",
                        flexDirection: "column",
                        color: "white",
                      }}
                    >
                      <span className="hex-prompt">{scannerOptions[scanOutputIndex]}:</span> <br />
                      {scannerOutput[scannerOptions[scanOutputIndex]]}
                    </span>
                  </div>{" "}
                </div>
                {stringToHex(metadata ? metadata.description : "No Metadata")}
              </div>{" "}
            </div>
            {imageSrc && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
