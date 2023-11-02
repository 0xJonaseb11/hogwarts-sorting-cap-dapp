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
  const [checkMintedSuccess] = useState(0);
  const [counter, setCounter] = useState(30);
  const [displayCounter, setDisplayCounter] = useState(false);
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
          // counter counts backwarfds from 60
  return (
    <div className="App">
     <img className="Hogwarts-logo" src={HogwartsLogo} alt="Hogwarts Logo" />
      <h1>Welcome to Hogwarts</h1>
    </div>
  )
}

export default App