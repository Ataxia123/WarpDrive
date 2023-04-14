import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

export default function ReadAIU() {
  const { address } = useAccount();
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [balance, setBalance] = useState<BigNumber>(ethers.BigNumber.from(0));
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();
  const provider = useProvider();
  const [metadata, setMetadata] = useState<any>(null);

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
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
    };

    fetchMetadata();
  }, [tokenURI]);
  const handleTokenIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTokenId(e.target.value);
  };

  return (
    <div>
      <h2>Read AIU</h2>
      <div>
        <p>Token IDs: {balance.toString()}</p>
      </div>
      <p>Token IDs: {tokenIds.length > 0 ? tokenIds.join(", ") : "Loading..."}</p>
      <div>
        <label htmlFor="tokenId">Select a Token ID:</label>
        <select id="tokenId" value={selectedTokenId} onChange={handleTokenIdChange}>
          <option value="">--Select Token ID--</option>
          {tokenIds.map(tokenId => (
            <option key={tokenId} value={tokenId}>
              {tokenId}
            </option>
          ))}
        </select>
      </div>
      {tokenURI && (
        <div>
          <p>Token URI: {tokenURI}</p>
          {/* Display other variables here */}
        </div>
      )}
      {metadata && (
        <div>
          <h3>Metadata:</h3>
          <p>ID: {metadata.ID}</p>
          <p>Name: {metadata.name}</p>
          <p>Description: {metadata.description}</p>
          <p>Image: {metadata.image}</p>
          <p>Attributes:</p>
          <ul>
            {metadata.attributes.map((attribute: any, index: number) => (
              <li key={index}>
                {attribute.trait_type}: {attribute.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
