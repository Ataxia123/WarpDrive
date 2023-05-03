import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  useAutoConnect();

  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="btn btn-primary btn-sm spaceship-display-screen"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <>
                    <span className="text-xs" style={{ color: networkColor }}>
                      {configuredNetwork.name}
                    </span>
                    <button className="btn btn-sm btn-error ml-2" onClick={openChainModal} type="button">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </button>
                  </>
                );
              }

              return (
                <div
                  className="items-center spaceship-display-screen"
                  style={{
                    position: "absolute",
                    height: "40%",
                    bottom: "0",
                  }}
                >
                  <div className="flex justify-center items-center screen-border">
                    {/* <div className="flex flex-row items-center">
                      <Balance address={account.address} className="" />
                      <span className="text-xs" style={{ color: networkColor }}>
                        {chain.name}
                      </span>
                    </div> */}

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex screen-border"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999999 }}
                    >
                      <BlockieAvatar address={account.address} size={24} ensImage={account.ensAvatar} />
                      <span className="" style={{ marginLeft: 8 }}>
                        {account.displayName}
                      </span>
                      <span>
                        <ChevronDownIcon className="" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
