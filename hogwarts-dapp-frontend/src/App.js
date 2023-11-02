import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import Web3 from "web3";
import HogwartsNFT from "./artifacts/HogwartsNFT.json";
import RandomHouseAssignment from "./artifacts/RandomHouseAssignment.json";
import HogwartsLogo from "./assets/hogwarts_logo.png";
import Lottie from "lottie-react";
import HPLoader from "./loaders/hpLoader.json";

// import App.css
import "./App.css";

//import audio
import gryffindorSound from "./sounds/gryffindor.mp3";
import hufflepuffSound from "./sounds/hufflepuff.mp3";
import ravenclawSound from "./sounds/ravenclaw.mp3";
import slytherinSound from "./sounds/slytherin.mp3";
import thinkingSound from "./sounds/thinking.mp3"; 
import bgSound from "./sounds/bg_music.mp3";
import { useEffect, useState } from "react";
import { errors } from "ethers";


//initialize a web3 library
const web3 = new Web3(window.ethereum);


const App = () => {

    // create app states
  const [account, setAccount] = useState("");
  const [hogwartsContract, setHogwartsContract] = useState(null);
  const [randomHouseContract, setRandomHouseContract] = useState(null);
  const [house, setHouse] = useState("");
  const [house_slogan, sethouseSlogan] = useState("");
  const [minted, setMinted] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkMintedSuccess, setCheckMintSuccess] = useState(0);
  const [counter, setCounter] = useState(30);
  const [displayCounter, setDisplayCounter] = useState(false);// counter counts backwarfds from 60
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserNameSubmitted, setIsUserNameSubmitted] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);


  const defaultLoadingMessage = "Ah, right then... hmm.. right";
  const dynamicLoadingMessage = `Ahh seems difficult, let me think harder, wait for ${counter}`;


  // let's try to connect with metamask
  useEffect(() => {
    if (started) {
      if (window.ethereum) {
        setConnected(true);
        window.ethereum.on("accountsChanged", (accounts) => {
          // update the connection status when the user changes account
          setAccount(accounts[0]);
          setConnected(true);
        });
        window.ethereum.on("disconnect", () => {
          // update the status when the user disconnects
          setAccount("");
          setConnected(false);
          setMinted(false);
          // reset the minted state when the user disconnects
        });
        window.ethereum.enable().then((accounts) => {
          setAccount(accounts[0]);
          const hogwartsAddress = "0x98229ae26542F6061b69159a628e2990De12A7fA";
          const randomHouseAddress = '0x4CFA2Cc2a3A7a4193d687E83Be4fD9A713Ce89A6';
          const hogwartsInstance = new Web3.eth.Contract(
            HogwartsNFT.abi, hogwartsAddress
          );
          const randomHouseInstance = new Web3.eth.Contract(
            RandomHouseAssignment.abi, randomHouseAddress
          );

          setHogwartsContract(hogwartsInstance);
          setRandomHouseContract(randomHouseInstance);

          checkMinted(); //check for a minted NFT when the app first loads

        });
      } else {
        alert("Install Metamask TO Use This App!");
      }
    }
  }, [started]);

  // To check for account and start changes
  useEffect(() => {
    if (started) {
      if (hogwartsContract || randomHouseContract || account) {
        checkMinted();
      }
    }
  }, [account, started]);


  const disconnectMetamask = async () => {
    try {
      await window.ethereum.enable();
      setConnected(false);
      setAccount("");
      setHouse("");
      sethouseSlogan("");
      stopBgSound("");
      setStarted(false);
      setIsUserNameSubmitted(false);
      setUserName("");
    } catch(err) {
      console.error(err);
    } 
  };

  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{eth_accounts: {}}]});
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const requestNFT = () => {
    randomHouseContract.methods
        .requestNFT(userName)
        .send({ from: account, value: web3.utils.toWei("0", "ether")})
        .on("transactionHash", function(hash) {
          console.log("Transaction sent. Transaction hash:", hash);
          setLoading(true); // set loading to true before sending the transaction

          // Play the thinking sound once the transaction is sent (User pays for the transaction)
          playThinkingSound();
        })
        .on("receipt", function (receipt) {
          console.log("Transaction successful:", receipt.transactionHash);
          checkNewMinted();
        })
        .on("error", (error) => {
          console.error("Error requesting NFT:", error);
          setLoading(false); // set loading back to false if there is an error during transaction
        });
  }


  const checkMinted = async () => {
    await checkName();
    const minted = hogwartsContract.methods.hasMintedNFt(account).call();
    console.log("minted:", minted);

    if (minted == true) {
      setMinted(true);
      await getHouseData();
      setLoading(false);
    } else {
      setMinted(false);
      setLoading(false);
    }
    setResponseLoading(false);
  };


  const checkName = async() => {
    setLoading(true);
    const name = await hogwartsContract.methods.s_addressToName(account).call();
    if (name) {
      setUserName(true);
      setIsUserNameSubmitted(true);
    }
    console.log("Name set");
  };


  const checkNewMinted = async () => {
    setDisplayCounter(true);
    setTimeout(async() => {
      const minted = await hogwartsContract.methods.hasMintedNFt(account).call();
      console.log(minted, checkMintedSuccess);

      if (minted == true) {
        setMinted(true);
        getHouseData();
        checkName();
        setLoading(false);
        setCounter(3);
        setDisplayCounter(false);
      } else if (checkMintedSuccess < 3) {
        setCheckMintSuccess(prev => prev + 1);
        setCounter(prev => prev - 1);
        checkNewMinted();
      }

    }, 800);
  }


  const getHouseData = async () => {
    setLoading(true);
    const houseIndex = await hogwartsContract.methods.getHouseIndex(account).call();
    const addressToHouse = [
      "Your belong in Gryffindor...",
      "You belong in Hufflepuff....",
      "You belong in wise old Ravenclaw....", 
      "You belong perhaps in Slytherin...."
    ];
    setHouse(addressToHouse[houseIndex]);

    const sloganToHouse = [
      "Where dwell the brave at heart. Their daring, nerve, and chivalry, Set Gryffindors apart.",    
      "Where they are just and loyal. Those patient Hufflepuffs are true And unafraid of toil.",    
      "you’ve a ready mind. Where those of wit and learning, Will always find their kind.",    
      "You’ll make your real friends. Those cunning folks use any means, To achieve their ends."
    ];
    sethouseSlogan(sloganToHouse[houseIndex]);

    //switch case for the logic
    switch(houseIndex) {
      case '0': playThinkingSound();
      break;
      
      case '1': playHufflepuffSound();
      break;

      case '2': playRavenclawSound();
      break;

      case '3': playSlytherinSound();
      break;

      default:
        break;
    }
    setLoading(false);
  };


          
  return (
    <div className="App">
     <img className="Hogwarts-logo" src={HogwartsLogo} alt="Hogwarts Logo" />
      <h1>Welcome to Hogwarts</h1>
    </div>
  )
}

export default App