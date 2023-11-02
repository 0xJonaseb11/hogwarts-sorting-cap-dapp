import React, { useState, useEffect } from "react";
import useSound from 'use-sound';
import Web3 from "web3";
import HogwartsNFT from "./artifacts/HogwartsNFT.json"; 
import RandomHouseAssignment from "./artifacts/RandomHouseAssignment.json"; 
import HogwartsLogo from "./assets/hogwarts_logo.png"; // import the image-LOGO

import "./App.css";

import Lottie from "lottie-react";
import HPLoader from "./loaders/hpLoader.json"

//import audio
import gryffindorSound from "./sounds/gryffindor.mp3";
import hufflepuffSound from "./sounds/hufflepuff.mp3";
import ravenclawSound from "./sounds/ravenclaw.mp3";
import slytherinSound from "./sounds/slytherin.mp3";
import thinkingSound from "./sounds/thinking.mp3"; 
import bgSound from "./sounds/bg_music.mp3";

const web3 = new Web3(window.ethereum);

function App() {
  const [account, setAccount] = useState("");
  const [hogwartsContract, setHogwartsContract] = useState(null);
  const [randomHouseContract, setRandomHouseContract] = useState(null);  
  const [house, setHouse] = useState("");
  const [house_slogan, sethouseSlogan] = useState("");
  const [minted, setMinted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [checkMintedSuccess, setCheckMintSuccess] = useState(0);
  const [counter, setCounter] = useState(60);
  const [displayCounter, setDisplayCounter] = useState(false);
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserNameSubmitted, setIsUserNameSubmitted] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  //initialize audio
  const [playBgSound, { stop: stopBgSound }] = useSound(bgSound, { loop: true });
  const [playThinkingSound] = useSound(thinkingSound, { loop: false });
  const [playGryffindorSound] = useSound(gryffindorSound, { loop: false });
  const [playHufflepuffSound] = useSound(hufflepuffSound, { loop: false });
  const [playRavenclawSound] = useSound(ravenclawSound, { loop: false });
  const [playSlytherinSound] = useSound(slytherinSound, { loop: false });

  const defaultLoadingMessage = "Ah, right then... hmm... right";
  const dynamicLoadingMessage = `Ahh seems difficult, let me think harder, wait for ${counter}`;
  
  useEffect(() => {
    if (started) {
	    if (window.ethereum) {
	      setConnected(true);
	      window.ethereum.on("accountsChanged", (accounts) => {
	        // update the connection status when the user changes accounts
	        setAccount(accounts[0]);
	        setConnected(true);
	      });
	      window.ethereum.on("disconnect", () => {
	        // update the connection status when the user disconnects
	        setAccount("");
	        setConnected(false);
	        setMinted(false); // Reset the minted state when the user disconnects
	      });
	      window.ethereum.enable().then((accounts) => {
	        setAccount(accounts[0]);
					const hogwartsAddress = "Your Hogwarts NFT smart contract address goes here";
	        const randomHouseAddress = "Your Random House Assignment smart contract address goes here";
	
	      const hogwartsInstance = new web3.eth.Contract(
	        HogwartsNFT.abi,
	        hogwartsAddress
	      );
	      const randomHouseInstance = new web3.eth.Contract(
	        RandomHouseAssignment.abi,
	        randomHouseAddress
	      );
	
	      setHogwartsContract(hogwartsInstance);
	      setRandomHouseContract(randomHouseInstance);
	    
	      
	      checkMinted(); // Check for a minted NFT when the app first loads
	      });
	    } else {
	      alert("Please install MetaMask to use this app!");
	    }
	  }
	  }, [started]);
	
	  useEffect(() => {
	    if (started) {
	    if (hogwartsContract|| randomHouseContract || account) {
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
      stopBgSound();
      setStarted(false);
      setIsUserNameSubmitted(false);
      setUserName("");
    } catch (err) {
      console.error(err);
    }
  };

  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const requestNFT = () => {
    randomHouseContract.methods
        .requestNFT(userName)
        .send({ from: account, value: web3.utils.toWei("0", "ether") })
        .on("transactionHash", function (hash) {
            console.log("Transaction sent. Transaction hash:", hash);
            setLoading(true); // Set loading to true before sending the transaction

            // Play the thinking sound once the transaction is sent (user pays for the transaction)
            playThinkingSound();
        })
        .on("receipt", function (receipt) {
            console.log("Transaction successful:", receipt.transactionHash);
            checkNewMinted();
  
        })
        .on("error", (error) => {
            console.error("Error requesting NFT:", error);
            setLoading(false); // Set loading back to false if there's an error during the transaction
        });
};
  
  //function to get the house of the contract
  const getHouseData = async () => {
    setLoading(true);
    const houseIndex = await hogwartsContract.methods.getHouseIndex(account).call();
    const addressToHouse = [
    "You belong in Gryffindor....", 
    "You belong in Hufflepuff....", 
    "You belong in wise old Ravenclaw....", 
    "You belong perhaps in Slytherin...."];
    setHouse(addressToHouse[houseIndex]);

    const sloganToHouse = [ 
      "Where dwell the brave at heart. Their daring, nerve, and chivalry, Set Gryffindors apart.",    
      "Where they are just and loyal. Those patient Hufflepuffs are true And unafraid of toil.",    
      "you’ve a ready mind. Where those of wit and learning, Will always find their kind.",    
      "You’ll make your real friends. Those cunning folks use any means, To achieve their ends."  ];      
    sethouseSlogan(sloganToHouse[houseIndex]);

    switch (houseIndex) {
      case '0':
        playGryffindorSound();
        break;
      case '1':
        playHufflepuffSound();
        break;
      case '2':
        playRavenclawSound();
        break;
      case '3':
        playSlytherinSound();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  // function to check if the user has minted an NFT
  const checkMinted = async () => {
    await checkName();
    const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
    console.log(minted);
    if (minted === true){
      setMinted(true);
      await getHouseData();
      setLoading(false);
    }
    else {
    setMinted(false);
    setLoading(false);
    }
    setResponseLoading(false);
 
  };

  console.log(userName);
  const checkName = async () => {
    setLoading(true);
    const name = await hogwartsContract.methods.s_addressToName(account).call();
    if (name) {
    setUserName(name);
    setIsUserNameSubmitted(true);}   
  };

  // function to check if the user has minted an NFT
  const checkNewMinted = async () => {
      setDisplayCounter(true);  // Set this to true here
      setTimeout(async() => {
      const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
      if (minted === true){
        setMinted(true);
        getHouseData();
        checkName();
        setLoading(false);
        setCounter(3); // Reset the counter
        setDisplayCounter(false);  // Reset to false once confirmed
      }
      else if(checkMintedSuccess < 3){
        setCheckMintSuccess(prev=>prev+1);
        setCounter(prev => prev - 1);  // Decrement the counter
        checkNewMinted();}
      }, 800);
    };
    
    const showNameField = ()=>(
      <div className="form">
        <input className="input-box"
          type="text" 
          placeholder="Enter your name" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          />
        <button className="form-button" onClick={() => {setUserName(userName); setIsUserNameSubmitted(true);}}>Submit</button>
      </div>)

    const startButton = ()=>(
      <button className="start-button" onClick={() => {setStarted(true); playBgSound(); setResponseLoading(true);}}>
      Let's go to the Great Hall
      </button>)

    const mintedView = ()=> (
        <>
          {loading || !house ? (
            <p>{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
          ) : (
            <>
              <p>{house}</p>
              {house_slogan.split('. ').map((slogan, index) => (
                <p key={index}>{slogan}</p>
              ))}
            </>
          )}
        </>
      
    )

    const mintNFT = () => (
      
        <>
          {!userName || !isUserNameSubmitted ? showNameField() :
          !loading ? <button onClick={requestNFT} disabled={minted}>Let's choose your house</button> : <p className="loading-button-msg">{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
          }
        </>
      
    )

    const style = {
      height: 250,
    };

    const connectedView = ()=> (
      <>
         {responseLoading ? <Lottie animationData={HPLoader} style={style} loop={true} /> : minted ? mintedView() : mintNFT()}
      <button className="metamask-button" onClick={disconnectMetamask}> disconnect wallet </button>
      </>
    )

    const gameStarted = ()=>(
      <>
      {  
        connected ? connectedView () : <button className="metamask-button" onClick={connectMetamask}> connect wallet </button>
      }    
      </>
    )

    return (
      <div className="App">
        <img className="Hogwarts-logo" src={HogwartsLogo} alt="Hogwarts Logo" />
        <h1>Welcome to Hogwarts {userName}</h1>
        
        {started ? gameStarted() : startButton()}
      </div>
    );
}  
    
export default App;
