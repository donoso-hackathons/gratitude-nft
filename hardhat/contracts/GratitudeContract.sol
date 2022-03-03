//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract GratitudeContract is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    Counters.Counter public _draftTokenIds;

    struct GEO {
       uint8 lat;
       uint8 lng;
    
    }

    struct NFT {
        address sender;
        address receiver;
        uint256 tokenId;
        NFTStatus status;
    
    }
    
    mapping(address => mapping(uint256 => NFT)) private _draftNftbyUser;
    mapping(uint256  => uint256) private _pending;
    enum NFTStatus {DRAFT, PENDING, TIMEOUT, ACCEPTED, REJECTED}


    constructor() ERC721("NG NFT Contract", "NGC") {
        // _setBaseURI("https://ipfs.io/ipfs/");
    }


    function createGratitudeToken (uint256 status, address receiver) 
    public
    returns (uint256) {
        require(status == 0 || status == 1, "ONLY STATUS DRAFT(0) OR PENDING(1) ARE ACCEPTED");
        console.log(receiver);
        console.log(address(0));
        _draftTokenIds.increment();
        uint256 draft_id = _draftTokenIds.current();
        if (status == 0) {

        } else {
        
         if (receiver != address(0)) {
         // TODO SET APPROVER TO RECEVIER INN THE CASE THAT ADDRESS IS AVAILABLE
         }    
        }
        
    
    

        return draft_id;

    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);

        // if (bytes(_tokenURIs[tokenId]).length != 0) {
        //     delete _tokenURIs[tokenId];
        // }
    }

    function mintItem(string memory _tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, _tokenURI);

        // _draftNftbyUser[msg.sender] = NFT({
        // status: NFTStatus.PENDING,
        // sender:msg.sender,
        // receiver:to,
        // tokenId:id
        //});

        return id;
    }
}
