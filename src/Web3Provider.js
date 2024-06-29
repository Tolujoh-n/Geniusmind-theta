import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          setSigner(ethersProvider.getSigner());
        } else {
          setConnected(false);
          setAccount("");
          setSigner(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setConnected(true);
      setSigner(provider.getSigner());
      await switchNetwork();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAccount("");
    setSigner(null);
  };

  const switchNetwork = async () => {
    const chainId = "0x169"; // 361 in hexadecimal
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: "Theta Mainnet",
                rpcUrls: ["https://eth-rpc-api.thetatoken.org/rpc"],
                nativeCurrency: {
                  name: "TFUEL",
                  symbol: "TFUEL",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.thetatoken.org/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
  };

  return (
    <Web3Context.Provider
      value={{
        connected,
        account,
        connectWallet,
        disconnectWallet,
        shortenAddress,
        provider,
        signer,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};
