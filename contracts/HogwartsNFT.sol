// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

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

    // lets create event to be envoked when Nft is minted
    event NftMinted(uint256 house, address minter, string name);

    /**let's set the initial contract state with 
    *@param  a constructor with our contract_Name and symbol HP
    */
    constructor() ER721("HogwartsNFT", "HP") {
        s_tokenCounter = 0;
    }
     
     /**this is a view read only funcn that allows anyone to check whether 
     *@param a specific address _user has already minted an NFT 
     *@param by returning a bool indecating minted or not
    */
    function hasMintedNFT(address _user) public view returns(bool) {
        return hasMinted[_user];
    }
    
    /**
    *@param This func allows anyone to query the index 
    *@param of the Hogwarts house associated 
    *@param with a specific address _user  also returns uint256 for index
    */

    function getHouseIndex(address _user) public view returns(uint256) {
        return s_addressToHouse[_user];
    }

    /**
    *@param lets allow contract owners to mint NFTs for users
    *@param and handles some errors, initialises a token, prevents double minting etc
    */

    function mintNft(address recipient, uint256 house, string memory name) external onlOwner {
        // ensure the address has not minted already
        require(!hasMinted[recipient], "You have already minted");

        uint256 tokenId = s_tokenCounter;
        _safeMint(recipient, tokenId);
        _setTokenURIs[house];
        s_addressToHouse[recipient] = house; // map house to address
        s_addressToName[recipient] = name; // map name to address
        s_tokenCounter += 1;
        //mark address as having minted an NFT
        hasMinted[recipient] = true;

        //emit event indicating that NFT has been minted
        emit NftMinted(house, recipient, name);
    }

    /**
    *@param This function overrides the _beforeTokenTransfer 
    *@param function of the parent contract ERC721.
    *@param it inforces a custom transfer condition where transfers
    *@param are only allowed from or to the zero address address(0),
    *@param indeicating that the tokens are soulbound within the hogwarts context
    *@param when the condition is not met, it reverts the transaction
    */

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) 
    internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        require(from == address(0) || to == address(0), "Err! This is not allowed in Our Hogwarts");
    }

}