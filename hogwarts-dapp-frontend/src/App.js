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


//initialize a web3 library
const web3 = new Web3(window.ethereum);


const App = () => {

  
  return (
    <div>App</div>
  )
}

export default App