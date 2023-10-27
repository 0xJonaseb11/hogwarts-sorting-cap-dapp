const hre = require("hardhat");

const vrfCoordinatorV2Address = process.env.VRFaddress;
const subId = process.env.SubId;
const keyHash = process.env.keyHash;
const callbackGasLimit = process.env.gasLimit;

async function main() {

    console.log("Deploying Hogwarts NFT Contract...")

    const HogwartsNFT = await hre.ethers.getContractFactory("HogwartsNFT");
    const hogwartsNFT = await HogwartsNFT.deploy();

    let currentBlock = await hre.ethers.provider.getBlockNumber();
    while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}

    const hogwartsAddress = await hogwartsNFT.getAddress();
    console.log("Hogwarts NFT deployed to:", hogwartsAddress);

    console.log("Deploying Random House Assignment Contract...")

    const RandomHouse = await hre.ethers.getContractFactory("RandomHouseAssignment");
    const randomHouse = await RandomHouse.deploy(hogwartsAddress, vrfCoordinatorV2Address, subId, keyHash, callbackGasLimit);

    while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}

    const randomAddress = await randomHouse.getAddress();
    console.log("Random House Assignment deployed to:", randomAddress);

    //Transfering ownership
    await hogwartsNFT.transferOwnership(randomAddress);
    console.log("Ownership transferred");

  }

  main();
