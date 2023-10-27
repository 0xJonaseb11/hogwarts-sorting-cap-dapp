// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { OpenZeppelin } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HogwartsNFT is ERC721URIStorage, Ownable {
    
    /**
    *let's create different mappings
    *@param first associated uint256 to address with address that made a request
    *@param second associates address to a uint256 with the index of the hogwarts house they received
    *@param third associates address to a bool which checks whether an address has already minted or not
    *@param fourth associates address to a string with the name of the address  
    */

    mapping(uint256 => address) public s_requestIdToSender;
    mapping(address => uint256) public s_addressToHouse;
    mapping(address => bool) public hasMinted;
    mapping(address => string) public s_addressToName;

    uint256 private s_tokenCounter; //keeps  track of the numbe of NFTs

    /**
    string  declares an internal array called houseTokenURIs 
    *@param which contains strings representing the URIs 
    *@param for the token metadata of the four Hogwarts 
    *@param houses (Gryffindor, Hufflepuff, Ravenclaw, Slytherin) 
    */
    string[] internal houseTokenURIs = [
        "ipfs://QmXja2QBKsNW9qnw9kKfcm25rJTomwAVJUrXekYFJnVwbg/Gryffindor.json",
        "ipfs://QmXja2QBKsNW9qnw9kKfcm25rJTomwAVJUrXekYFJnVwbg/Hufflepuff.json",
        "ipfs://QmXja2QBKsNW9qnw9kKfcm25rJTomwAVJUrXekYFJnVwbg/Ravenclaw.json",
        "ipfs://QmXja2QBKsNW9qnw9kKfcm25rJTomwAVJUrXekYFJnVwbg/Slytherin.json"
    ];
}