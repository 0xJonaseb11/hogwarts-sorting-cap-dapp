const hre = require("hardhat");

const vrfCoordinatorV2Address = process.env.VRFaddress;
const subId = process.env.SubId;
const keyHash = process.env.keyHash;
const callbackGasLimit = process.env.gasLimit;

async function main() {
    
  // Deploying Hogwarts NFT Contract:
    console.log("Deploying Hogwarts NFT Contract...")

    const HogwartsNFT = await hre.ethers.getContractFactory("HogwartsNFT");
    const hogwartsNFT = await HogwartsNFT.deploy();

    let currentBlock = await hre.ethers.provider.getBlockNumber();

    // Waiting for Confirmation Blocks:
    while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}
    

    // Getting the Contract Address:
    const hogwartsAddress = await hogwartsNFT.getAddress();
    console.log("Hogwarts NFT deployed to:", hogwartsAddress);

    // Deploying Random House Assignment Contract:
    console.log("Deploying Random House Assignment Contract...")

    const RandomHouse = await hre.ethers.getContractFactory("RandomHouseAssignment");
    const randomHouse = await RandomHouse.deploy(hogwartsAddress, vrfCoordinatorV2Address, subId, keyHash, callbackGasLimit);
    
    // Waiting for Confirmation Blocks:(again)
    while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}
    
    // Getting the Contract Address (Again):
    const randomAddress = await randomHouse.getAddress();
    console.log("Random House Assignment deployed to:", randomAddress.target);

    //Transfering ownership
    await hogwartsNFT.transferOwnership(randomAddress);
    console.log("Ownership transferred");

  }


  // invoke func here
  main();
