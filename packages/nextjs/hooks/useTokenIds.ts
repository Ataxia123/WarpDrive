import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth/useScaffoldEventSubscriber";

// Update the import path accordingly

export default function useTokenIds() {
  const { address } = useAccount();
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [balance, setBalance] = useState<BigNumber>(ethers.BigNumber.from(0));
  const provider = useProvider();

  useScaffoldEventSubscriber({
    contractName: "WarpDrive",
    eventName: "Transfer",
    listener: (from: string, to: string, tokenId: BigNumber) => {
      if (to.toLowerCase() === address?.toLowerCase()) {
        setTokenIds(prevTokenIds => [...prevTokenIds, tokenId.toString()]);
      }
    },
  });

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (address && deployedContract) {
        const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
        const userBalance = await contract.balanceOf(address);
        if (!userBalance.eq(balance)) {
          setBalance(userBalance);
        }
      }
    };

    fetchTokenIds();
  }, [address, deployedContract]);

  return { tokenIds, balance };
}
