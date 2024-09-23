import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import CrowdFundingABI from "../constants/CrowdFundingABI";
import { CONTRACT_ADDRESS } from "../constants/contractAddress";

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = web3Provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI, signer);
        const accounts = await web3Provider.listAccounts();

        setProvider(web3Provider);
        setSigner(signer);
        setContract(contract);
        setAccount(accounts[0]);
      }
    };

    connectWallet();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, contract, account }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
