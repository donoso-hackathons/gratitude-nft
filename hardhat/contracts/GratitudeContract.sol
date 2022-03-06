//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract GratitudeContract is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    Counters.Counter public _campaignIds;

    struct GEO {
        uint16 lat;
        uint16 lng;
    }

    struct NFT {
        address receiver;
        uint256 tokenId;
        NftStatus status;
        GEO geo;
        uint256 timeStamp;
        string tokenUri;
        bytes32 linkCode;
    }

    enum NftStatus {
        DRAFT,
        PENDING,
        STANDBY,
        TIMEOUT,
        ACCEPTED,
        REJECTED
    }

    struct Campaign {
        uint256 campaignId;
        CampaignStatus status;
        string campaignUri;
        address campaign_creator;
    }

    enum CampaignStatus {
        ONBOARD,
        ACCEPTED,
        REJECTED
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

    ///// Gratitude Events
    event GratitudeTokenCreationEvent(
        uint256 indexed tokenId,
        NftStatus status,
        address sender,
        address receiver,
        uint256 lat,
        uint256 lng,
        string tokenUri
    );
    event GratitudTokenChangeStatusEvent(uint256 tokenId, NftStatus  status);
    event GratitudTokenAceptedEvent(uint256 tokenId, NftStatus status,  uint256 lat, uint256 lng);


    //Global Campaign Mapping
    mapping(uint256 => Campaign) private _campaignById;

    ///// Campaign Events
    event GratitudeCampaignCreatedEvent(
        uint256 indexed campaignId,
        address campaign_creator,
        CampaignStatus status,
        string campaignUri,
        string name
    );
    event GratitudeCampaignVerified(uint256 campaignId);
    event GratitudeCampaignRejected(uint256 campaignId);

    constructor() ERC721("GRATITUDE NFT", "GRA") {
        // _setBaseURI("https://ipfs.io/ipfs/");
    }

    // ============ CREATOR ACTIVITY  PUBLIC FUNCTIONS ============ 
    
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
    ) external payable {
        require(
            _status == 0 || _status == 1,
            "ONLY STATUS DRAFT(0) OR PENDING(1) ARE ACCEPTED"
        );
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
 
        NFT memory _newGratitudeNft = NFT({
            status: NftStatus.DRAFT,
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
            _newGratitudeNft.status = NftStatus.PENDING;
            if (_receiver != address(0)) {
                // IF RECEIVER ADDRESS IS KNOWN THEN SET APPROVER ADDRESS TO RECEIVER
                _approvePending[id] = _receiver;
            }
        }

            _mint(msg.sender, id);
            _newGratitudeNft.tokenId = id;
            _balanceByCreator[msg.sender] += 1;
            _createdGratitudeNFT[msg.sender][_balanceByCreator[msg.sender]] = id;
            _gratitudeNftbyId[id] = _newGratitudeNft;

          emit GratitudeTokenCreationEvent(id, NftStatus(_status), msg.sender, _receiver, _geo.lat, _geo.lng, _tokenUri);  

    }

    /**
     * @notice Get Gratitude token status
     *
     * @param _tokenId    token to lookup
     */
    function getStatus(uint256 _tokenId) public view returns (NftStatus) {
        return _gratitudeNftbyId[_tokenId].status;
    }

    /**
     * @notice when status is pending it may be that is already timeout, sould change if timeout
     *
     * @param _tokenId    token to lookup
     */
    function checkPendingStatusPriorToGet(uint256 _tokenId) public  {
        bool isInTimeStamp = _gratitudeNftbyId[_tokenId].timeStamp + 10 * 60 >
            block.timestamp;

        if (
            !isInTimeStamp &&
            _gratitudeNftbyId[_tokenId].status == NftStatus.PENDING &&
            _gratitudeNftbyId[_tokenId].receiver == address(0) &&
            ERC721.ownerOf(_tokenId) == msg.sender
        ) {
            _gratitudeNftbyId[_tokenId].status = NftStatus.TIMEOUT;
        }
    }

    /**
     * @notice creator can cancel the pending status and set status to stand by to send again
     *
     *
     * @param _tokenId    token to lookup
     */
    function cancelWhenStillPending(uint256 _tokenId) public {
        require(ERC721.ownerOf(_tokenId) == msg.sender, "NOT CREATOR");
        require(
            _gratitudeNftbyId[_tokenId].status == NftStatus.PENDING,
            "NFT NOT IN PENDING STATUS"
        );

        _gratitudeNftbyId[_tokenId].status = NftStatus.STANDBY;
        emit GratitudTokenChangeStatusEvent(_tokenId, NftStatus.STANDBY);
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
        NftStatus _status = _gratitudeNft.status;
        require(
            (_status == NftStatus.REJECTED ||
                _status == NftStatus.STANDBY ||
                _status == NftStatus.TIMEOUT) &&
                ERC721.ownerOf(_tokenId) == msg.sender,
            "NFT IS NOT REJECTED NOR TIMEOUT NOR STANDBY"
        );
        _gratitudeNft.status = NftStatus.PENDING;
        _gratitudeNft.linkCode = keccak256(abi.encodePacked(_linkCode));
        if (_receiver != address(0)) {
            // IF RECEIVER ADDRESS IS KNOWN THEN SET APPROVER ADDRESS TO RECEIVER
            _approvePending[_tokenId] = _receiver;
        }
        emit GratitudTokenChangeStatusEvent(_tokenId, NftStatus.PENDING);
    }

    /**
     * @notice  Get creator tokens, some already can be already transferred
     *
     *
     *
     */
    function getCreatorTokens() public view returns (NFT[] memory) {
        uint256 balance = _balanceByCreator[msg.sender];

        NFT[] memory _creatorNFTs = new NFT[](balance);

        for (uint256 i = 0; i < balance; i++) {
            _creatorNFTs[i] = _gratitudeNftbyId[i + 1];
        }

        return _creatorNFTs;
    }

    // ============ RECEIVER ACTIVITY WHEN LINKCODE IN URL ============

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
            _gratitudeNftbyId[id].status == NftStatus.PENDING,
            "NFT NOT IN PENDING STATUS"
        );
        _gratitudeNftbyId[id].status = NftStatus.REJECTED;
        emit GratitudTokenChangeStatusEvent(id, NftStatus.REJECTED);
    }

    /**
     * @notice helper modifier to check that the status is pending and we are in timestamp Window of 10 min
     *
     * @param _tokenId token to lookup
     */
    function _isTimeStampReady(uint256 _tokenId) internal returns (bool) {
        if (_gratitudeNftbyId[_tokenId].status != NftStatus.PENDING) {
            return false;
        }

        bool isInTimeStamp = _gratitudeNftbyId[_tokenId].timeStamp + 10 * 60 >
            block.timestamp;
        if (!isInTimeStamp) {
            _gratitudeNftbyId[_tokenId].status = NftStatus.TIMEOUT;
            return false;
        }
        return true;
    }

    /**
     * @notice The Receiveraccept the NFT
     *
     * @param _linkCode linkCode received in URL
     */
    function acceptLinkHash(string memory _linkCode, GEO memory _geo) public {
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
        _gratitudeNftbyId[id].status = NftStatus.ACCEPTED;
        emit GratitudTokenAceptedEvent(id, NftStatus.ACCEPTED, _geo.lat,_geo.lng);
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
            _gratitudeNftbyId[tokenId].status == NftStatus.ACCEPTED);
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
    ) public override nonReentrant {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId) ||
                _isApprovedbyPending(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved or NFT not yet accepted"
        );
        _safeTransfer(from, to, tokenId, "");
    }

    // ============ CREATE CAMPAIGNS  PUBLIC FUNCTIONS ============

    /**
     * @notice The receiver retrieve GratitudeNFT wen receiving the linkcode
     *
     * @param _campaignUri received in URL
     */
    function createCampaign(string memory _name,string memory _campaignUri)
        public
        nonReentrant
        {
   
        _campaignIds.increment();
        uint256 id = _campaignIds.current();
            Campaign memory _newCampaign = Campaign({
            campaignId: id,
            status: CampaignStatus.ONBOARD,
            campaignUri:_campaignUri, 
            campaign_creator: msg.sender
            });

            _campaignById[id] = _newCampaign;
        emit GratitudeCampaignCreatedEvent(id, msg.sender, CampaignStatus.ONBOARD, _campaignUri,_name); 
    }

    function getCampaignStatus(uint256 _campaignId) public view returns(CampaignStatus){
        return _campaignById[_campaignId].status;
    }

    // ============= OWNER-ONLY ADMIN FUNCTIONS  ============

    function approveCampaign(uint256 _campaignId) external onlyOwner {
         _campaignById[_campaignId].status = CampaignStatus.ACCEPTED;
         emit GratitudeCampaignVerified(_campaignId);
       
    }

    function rejectCampaign(uint256 _campaignId) external onlyOwner {
         _campaignById[_campaignId].status = CampaignStatus.REJECTED;
         emit GratitudeCampaignRejected(_campaignId);
    }

    receive() external payable {}

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
