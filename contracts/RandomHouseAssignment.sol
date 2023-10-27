// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
*@author @Jonas-sebera
*@param This contract will be responsible 
*@param for randomly assigning Hogwarts houses to users. 
*/

import { HogwartsNFT } from "./HogwartsNFT.sol";
import { VRFCoordinatorV2Interface } from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import { VRFConsumerBaseV2 } from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract RandomHouseAssignment is VRFConsumerBaseV2 {

    //state variables
    HogwartsNFT public nftContract; //an instance of HogwartsNFT contract
    VRFCoordinatorV2Interface private i_vrfCoordinator;
    uint64 private i_subscriptionId;
    bytes32 private i_keyHash;
    uint32 private i_callbackGasLimit;
    
    mapping(uint256 => address) private s_requestIdToSender;
    mapping(address => string) private s_nameToSender;

}