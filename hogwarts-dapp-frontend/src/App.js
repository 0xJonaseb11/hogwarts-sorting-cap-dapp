import React { useState, useEffect } from "react";
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
import { useState } from "react";


//initialize a web3 library
const web3 = new Web3(window.ethereum);


const App = () => {

    // create app states
  const [account, setAccount] = useState("");
  const [hogwartsContract, setHogwartsContract] = useState(null);
  const [randomHouseContract, setRandomHouseContract] = useState(null);
  const [house, setHouse] = useState("");
  const [house_slogan, sethouseSlogan] = useState("");
  const [minted, setMint] = useState("");
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
          // counter counts backwarfds from 60
  return (
    <div>App</div>
  )
}

export default App