//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract GratitudeContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    struct GEO {
        uint8 lat;
        uint8 lng;
    }

    struct NFT {
        address receiver;
        uint256 tokenId;
        NFTStatus status;
        GEO geo;
        uint256 timeStamp;
        string tokenUri;
        bytes32 linkCode;
    }

    ///Global NFT Mapping
    mapping(uint256 => NFT) private _gratitudeNftbyId;

    //// Needed for getting created NFT details
    mapping(address => mapping(uint256 => uint256))
        private _createdGratitudeNFT;

    //// Needed for report all created items
    mapping(address => uint256) private _balanceByCreator;

    ///// Needed to get token infooo when received
    mapping(bytes32 => uint256) private _linkCodeHashToId;

    ///// Needed to approve transfer while pending
    mapping(uint256 => address) private _approvePending;

    enum NFTStatus {
        DRAFT,
        PENDING,
        STANDBY,
        TIMEOUT,
        ACCEPTED,
        REJECTED
    }

    constructor() ERC721("GRATITUDE NFT", "GRA") {
        // _setBaseURI("https://ipfs.io/ipfs/");
    }

    /**************************************************************************
     * CREATOR ACTIVITY
     *************************************************************************/

    /**
     * @notice Function to create the gratitude
     * @param _status     STATUS os the NFT for thetime being only pending, if we have time draft also;
     * @param _receiver   If the _reveicer is known by creation
     *                    we will add a layer security ensuring that con be only transfered to receiver
     *                    otherwise pass '0x0000000000000000000000000000000000000000'
     * @param _geo        for the time being pass {lat:0, lng:0}, if we have more time we could ask
     *                    location and with THEGRAPH query after coordinates and paint a world of gratitude (DREAM)
     * @param _timeStamp  timestamp in sec  Math.ceil((new Date().getTime())/1000)
     * @param _tokenUri   IPFS url of the json file defining the NFT atributes
     * @param _linkCode   randomString of 1o characters to be stored as kecca256
     *
     *
     * Example args:      [1,'0x0000000000000000000000000000000000000000', {lat:0, lng:0}, 12345631, 'https://tokenuri', '67hghkihy9']
     */
    function createGratitudeToken(
        uint256 _status,
        address _receiver,
        GEO memory _geo,
        uint256 _timeStamp,
        string memory _tokenUri,
        string memory _linkCode
    ) public {
        require(
            _status == 0 || _status == 1,
            "ONLY STATUS DRAFT(0) OR PENDING(1) ARE ACCEPTED"
        );
        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        NFT memory _newGratitudeNft = NFT({
            status: NFTStatus.DRAFT,
            receiver: _receiver,
            geo: _geo,
            tokenId: id,
            timeStamp: _timeStamp,
            tokenUri: _tokenUri,
            linkCode: keccak256(abi.encodePacked(_linkCode))
        });

        _linkCodeHashToId[_newGratitudeNft.linkCode] = id;

        if (_status == 1) {
            /// IF GRATITUDE TOKEN IS READY MINT NFT, SET STATUS TO PENDING
            _newGratitudeNft.status = NFTStatus.PENDING;

            _mint(msg.sender, id);
            _newGratitudeNft.tokenId = id;
            _balanceByCreator[msg.sender] += 1;
            _createdGratitudeNFT[msg.sender][
                _balanceByCreator[msg.sender]
            ] = id;
            _gratitudeNftbyId[id] = _newGratitudeNft;

            if (_receiver != address(0)) {
                // IF RECEIVER ADDRESS IS KNOWN THEN SET APPROVER ADDRESS TO RECEIVER
                _approvePending[id] = _receiver;
            }
        }
    }
    /**
     * @notice Get Gratitude token status
     *
     * @param _tokenId    token to lookup
     */
    function getStatus(uint256 _tokenId) public view returns (NFTStatus) {
        return _gratitudeNftbyId[_tokenId].status;
    }

    /**
     * @notice when status is pending it may be that is already timeout, sould change if timeout
     *
     * @param _tokenId    token to lookup
     */
    function checkPendingStatusPriorToGet(uint256 _tokenId) public {
        bool isInTimeStamp = _gratitudeNftbyId[_tokenId].timeStamp + 10 * 60 >
            block.timestamp;

        if (
            !isInTimeStamp &&
            _gratitudeNftbyId[_tokenId].status == NFTStatus.PENDING &&
            _gratitudeNftbyId[_tokenId].receiver == address(0) &&
            ERC721.ownerOf(_tokenId) == msg.sender
        ) {
            _gratitudeNftbyId[_tokenId].status = NFTStatus.TIMEOUT;
        }
    }

    /**
     * @notice creator can cancel the pending status and set status to stand by to send again
     *
     *
     * @param _tokenId    token to lookup
     */
    function cancelWhenStillPending(uint256 _tokenId) public {
        require(
                ERC721.ownerOf(_tokenId) == msg.sender,
            "NOT CREATOR"
        );
        require(
            _gratitudeNftbyId[_tokenId].status == NFTStatus.PENDING,
            "NFT NOT IN PENDING STATUS"
        );

        _gratitudeNftbyId[_tokenId].status = NFTStatus.STANDBY;
    }

    /**
     * @notice When the nft has been rejected or is timeout or is in standby we can resend it again
     *
     *
     * @param _tokenId    token to resend
     * @param _receiver   If the _reveicer is known by creation
     *                    we will add a layer security ensuring that con be only transfered to receiver
     *                    otherwise pass '0x0000000000000000000000000000000000000000'
     * @param _linkCode   randomString of 1o characters to be stored as kecca25
     */
    function resendWhenTimeOutOrRejectedOrStandby(
        uint256 _tokenId,
        address _receiver,
        string memory _linkCode
    ) public {
        NFT storage _gratitudeNft = _gratitudeNftbyId[_tokenId];
        NFTStatus _status = _gratitudeNft.status;
        require(
            (_status == NFTStatus.REJECTED ||
                _status == NFTStatus.STANDBY ||
                _status == NFTStatus.TIMEOUT) &&
                ERC721.ownerOf(_tokenId) == msg.sender,
            "NFT IS NOT REJECTED NOR TIMEOUT NOR STANDBY"
        );
        _gratitudeNft.status = NFTStatus.PENDING;
        _gratitudeNft.linkCode = keccak256(abi.encodePacked(_linkCode));
        if (_receiver != address(0)) {
            // IF RECEIVER ADDRESS IS KNOWN THEN SET APPROVER ADDRESS TO RECEIVER
            _approvePending[_tokenId] = _receiver;
        }
    }

    /**************************************************************************
     * RECEIVER ACTIVITY WHEN LINKCODE IN URL
     *************************************************************************/

    /**
     * @notice The receiver retrieve GratitudeNFT wen receiving the linkcode
     *
     * @param _linkCode linkCode received in URL
     */
    function getGratitudeNFtByLinkCode(string memory _linkCode)
        public
        view
        returns (NFT memory)
    {
        bytes32 _linkCodeHash = keccak256(abi.encodePacked(_linkCode));
        uint256 id = _linkCodeHashToId[_linkCodeHash];
        return _gratitudeNftbyId[id];
    }

    /**
     * @notice The Receiver Reject the NFT
     *
     * @param _linkCode linkCode received in URL
     */
    function rejectGratitudeNFTbyLinkCode(string memory _linkCode) public {
        bytes32 _linkCodeHash = keccak256(abi.encodePacked(_linkCode));
        uint256 id = _linkCodeHashToId[_linkCodeHash];
        require(
            _gratitudeNftbyId[id].status == NFTStatus.PENDING,
            "NFT NOT IN PENDING STATUS"
        );
        _gratitudeNftbyId[id].status = NFTStatus.REJECTED;
    }

    /**
     * @notice helper modifier to check that the status is pending and we are in timestamp Window of 10 min
     *
     * @param _tokenId token to lookup
     */
    function _isTimeStampReady(uint256 _tokenId) internal returns (bool) {
        if (_gratitudeNftbyId[_tokenId].status != NFTStatus.PENDING) {
            return false;
        }

        bool isInTimeStamp = _gratitudeNftbyId[_tokenId].timeStamp + 10 * 60 >
            block.timestamp;
        console.log(_gratitudeNftbyId[_tokenId].timeStamp);
        console.log(block.timestamp);
  
        console.log(isInTimeStamp);

        if (!isInTimeStamp) {
            _gratitudeNftbyId[_tokenId].status = NFTStatus.TIMEOUT;
            return false;
        }
        return true;
    }

    /**
     * @notice The Receiveraccept the NFT
     *
     * @param _linkCode linkCode received in URL
     */
    function acceptLinkHash(string memory _linkCode) public {
        bytes32 _linkCodeHash = keccak256(abi.encodePacked(_linkCode));
        address to = msg.sender;
        uint256 id = _linkCodeHashToId[_linkCodeHash];
        address owner = ERC721.ownerOf(id);
        if (_approvePending[id] == to) {
            transferFrom(owner, to, id);
        } else {
            require(
                _isTimeStampReady(_linkCodeHashToId[_linkCodeHash]),
                "TIMEOUT"
            );
            _approvePending[id] = to;
            transferFrom(owner, to, id);
        }
        _gratitudeNftbyId[id].status = NFTStatus.ACCEPTED;
    }

    /**
     * @notice Override the isApproveorOwner,
     * here we request that the trasfer can only happen when the token is not in pending status (alreadyaccepted)
     *
     * @param spender address to transfer the
     * @param tokenId tokenId needed to get Status
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        override
        returns (bool)
    {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        );
        address owner = ERC721.ownerOf(tokenId);
        return ((spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender)) &&
            _gratitudeNftbyId[tokenId].status == NFTStatus.ACCEPTED);
    }

    /**
     * @notice If by the GratitudeNFT creation the receiver address is passed, this method patch the approve methos
     *
     * @param spender address to transfer the
     * @param tokenId tokenId needed to get Status
     */
    function _isApprovedbyPending(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return _approvePending[tokenId] == spender;
    }

    /**
     * @notice The transfermethod sould works as per the ERC721 standard
     *          we, only ensure that no token can be hard-transfered when NOT yet accepted
     *
     * @param from address from to transfer the token
     * @param to address to transfer the token
     * @param tokenId tokenId needed to transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId) ||
                _isApprovedbyPending(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved or NFT not yet accepted"
        );

        _transfer(from, to, tokenId);
    }

    /**************************************************************************
     * ENNUMERABLE CONTRACT FUNCTIONS AND MAPPICS FOR REPORTING ACCEPTED NFT'S
     *************************************************************************/
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        require(
            index < ERC721.balanceOf(owner),
            "ERC721Enumerable: owner index out of bounds"
        );
        return _ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(
            index < totalSupply(),
            "ERC721Enumerable: global index out of bounds"
        );
        return _allTokens[index];
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId)
        private
    {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }
}
