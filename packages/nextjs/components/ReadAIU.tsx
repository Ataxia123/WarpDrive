import { FunctionComponent, useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

interface ReadAIUProps {
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  onMetadataReceived: (metadata: any) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  isFocused: boolean; // Add this prop
  isMinimized: boolean; // Add this prop
  onToggleMinimize: () => void; // Add this prop
  onSubmit: (type: "character" | "background") => Promise<void>;
}

export const ReadAIU: FunctionComponent<ReadAIUProps> = ({
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

  console.log("---------_CONSOLELOG_---------");
  console.log("isFocused: ", isFocused, "address: ", address, "TransferEvents", transferEvents);

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
    if (metadata && metadata.image) {
      const ipfsGateway = "https://ipfs.io"; // Choose a gateway
      const imageUrl = metadata.image.replace("ipfs://", `${ipfsGateway}/ipfs/`);
      setImageSrc(imageUrl);
      onImageSrcReceived(imageUrl); // Add this line
      console.log("Image URL:", imageUrl);
    }
  }, [metadata]);

  return (
    <>
      <div
        className="screen-border spaceship-display-screen thefinal"
        style={{
          position: "absolute",
          height: "12%",
          top: "58.3%",
          width: "10.5%",
          left: "45%",
          opacity: "0.5",
        }}
      >
        THeFinalDiv
      </div>
      <div onMouseEnter={() => setMouseTrigger(true)} className="toggle-minimize-button spaceship-display-screen">
        <div onMouseEnter={onToggleMinimize} onMouseLeave={onToggleMinimize} className="spaceship-display-screen">
          <div className="screen-border">
            {metadata?.attributes[1].value}
            {""}
            {metadata?.attributes[2].value} {""}
            {metadata?.attributes[3].value} {""}
            {metadata?.attributes[4].value}
            <br />
            <select
              id="tokenId"
              value={selectedTokenId}
              onChange={handleTokenIdChange}
              className=" dropdown-container "
            >
              <option value="hex-prompt dropdown-option">-ID-</option>
              {tokenIds?.map(tokenId => (
                <option key={tokenId} value={tokenId}>
                  {selectedTokenId}
                </option>
              ))}
            </select>
            <button
              className="spaceship-display-screen hex-data master-button"
              onClick={() => console.log("Button onSubmit()")}
            >
              ButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHereButtonGoesHere
            </button>
          </div>
        </div>
      </div>

      <div className={`spaceship-display-screen token-selection-panel${isMinimized ? "-focused" : ""}`}>
        <div className="screen-border">
          {metadata && (
            <>
              <div className="panel-content">
                {imageSrc && (
                  <div className="image-column">
                    <img className="focused-image-display" src={imageSrc} alt={metadata?.name} />
                  </div>
                )}

                <div className="text-column">
                  <h3 className="description-text">Description:</h3>
                  <p>{metadata.description}</p>
                  <h3 className="description-text">Attributes:</h3>
                  <ul>
                    {metadata.attributes.map((attribute: any, index: number) => (
                      <li key={index}>
                        {attribute.trait_type}: {attribute.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          <h3 className="panel-title focused-title description-text position-relative">
            {"  >TU VIEJA<"}

            <div className="panel-content justify-center">
              {metadata?.attributes[1].value}
              {""}
              {metadata?.attributes[2].value} {""}
              {metadata?.attributes[3].value} {""}
              {metadata?.attributes[4].value}
            </div>
          </h3>
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
