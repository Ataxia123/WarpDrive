import { FunctionComponent, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
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
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [balance, setBalance] = useState<BigNumber>(ethers.BigNumber.from(0));
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();
  const provider = useProvider();
  const [metadata, setMetadata] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string>();

  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: 15795907, // Set an appropriate starting block number
    filters: { to: address },
  });

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (address && deployedContract) {
        const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
        const userBalance = await contract.balanceOf(address);
        if (!userBalance.eq(balance)) {
          setBalance(userBalance);
        }

        if (transferEvents) {
          const ownedTokenIds = transferEvents.map(event => event.args.tokenId.toString());
          setTokenIds(ownedTokenIds);
          onTokenIdsReceived(ownedTokenIds); // Add this line
        }
      }
    };

    fetchTokenIds();
  }, [address, deployedContract, transferEvents]);

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
      <div className={`token-selection-panel${isMinimized ? "-focused" : ""}`}>
        <div className={`dropdown-container${isMinimized ? "-focused" : ""}`}>
          <select id="tokenId" value={selectedTokenId} onChange={handleTokenIdChange} className="dropdown-select">
            <option value="">incoming transmisionID--</option>
            {tokenIds.map(tokenId => (
              <option key={tokenId} value={tokenId} className="">
                {tokenId}
              </option>
            ))}
          </select>
        </div>

        {isMinimized ? (
          <>
            {metadata && (
              <>
                <div className="content-container spaceship-display-screen focused-spaceship-display-screen">
                  {imageSrc && (
                    <div className="image-column">
                      <img className="image-component " src={imageSrc} alt={metadata?.name} />
                    </div>
                  )}

                  <div className="text-response text-column">
                    <h3>Description:</h3>
                    <p>{metadata.description}</p>
                    <h3>Attributes:</h3>
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
          </>
        ) : (
          <div className="spaceship-display-screen">
            {imageSrc && <img className="image-display" src={imageSrc} alt={metadata?.name} />}
          </div>
        )}
        <div>
          <button className="toggle-minimize-button" onClick={onToggleMinimize}>
            {"^|v"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
