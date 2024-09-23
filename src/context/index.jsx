import React, { useContext, createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Import contract address and ABI from constants
import { CONTRACT_ADDRESS } from '../constants/contractAddress.js';
import CrowdFundingABI from "../constants/CrowdFundingABI";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI, signer);
        const address = await signer.getAddress();

        setProvider(provider);
        setContract(contract);
        setAddress(address);
      } else {
        console.error("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const connect = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
  };

  const publishCampaign = async (form) => {
    try {
      const targetAmount = ethers.utils.parseEther(form.target.toString());
      const tx = await contract.createCampaign(
        address,
        form.title,
        form.description,
        targetAmount,
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image
      );
      await tx.wait();
      console.log("Contract call success", tx);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (pId, amount) => {
    const tx = await contract.donateToCampaign(pId, { value: ethers.utils.parseEther(amount) });
    await tx.wait();
    return tx;
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators(pId);
    const parsedDonations = donations[0].map((donator, i) => ({
      donator,
      donation: ethers.utils.formatEther(donations[1][i].toString()),
    }));
    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
