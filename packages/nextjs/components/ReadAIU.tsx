import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

// Update the import path accordingly

export default function ReadAIU() {
  const { address } = useAccount();
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [balance, setBalance] = useState<BigNumber>(ethers.BigNumber.from(0));
  const provider = useProvider();

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

  return (
    <div>
      <h2>Read AIU</h2>
      <div>
        <p>Token IDs: {balance.toString()}</p>
      </div>
      <p>Token IDs: {tokenIds.length > 0 ? tokenIds.join(", ") : "Loading..."}</p>
    </div>
  );
}
