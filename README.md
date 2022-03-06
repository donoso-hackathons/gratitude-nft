# Gratitude NFT

Gratitude NFT a Dapp Hackathon project that aims to create the the platform to mint and send to friends gratitude tokens
[See demo](https://gratitude-nft.web.app/)

The user can upload an image or take a photo and create an NFT for sending to someone, if he knows the address of the receiver he can input, if not 
a link will generated for 10 min where he could accept the gratitude nft token

The dapp also allows to create campaigns o send gratitude help in occasions like now for a specific address in Ukraine.
This campaigns will be verified by the gratitude-nft team.

The gratitude nft token is a ERC721 token wrapper which adds some status and helper methods for sending and accepting.
As well as the tokens, so the campagins are minted on chain, and in both cases Uri are saven in ipfs.
Querying the campaigns and the nft's are done with subgraph.


# 🏄‍♂️ Quick Start

## localhost (for now)

Create a copy of /hardhat/sample.env

```javascript
npm run chain
// spin blockchain node on localhost creating 10 accounts and private keys
```

```javascript
npm run watch-contract
// launch, compile, and deploy in watch mode. To deploy on Polygon Testnet, run
npm run watch-contract mumbai
// Mumbai deployment requires free Moralis account
```

```javascript
ng serve -o
// build app and serve on localhost:4200. Alternatively, run
ng serve -o -c mumbai
// to use your configured Mumbai testnet wallet
```

### other helpful commands

```javascript
npm run compile
// compile contracts
```

```javascript
npm run deploy
// deploy contract to localhost. Alternatively you can run
npm run deploy:mumbai
// to deploy on Polygon Testnet
```

## testnet/livenet

Either deploying to localhost node or testnet/cloud the conract has to be compiled

```javascript
npm run compile
// compile the demo app contract in hardhat/contracts/demoContract.sol
```

When compiling, the contract artifacts will be created in the angular project assets folder.

🔏 You can edit your smart contract `.sol` in `/hardhat/contracts` and recompile with same command

Now is time to deploy our contract

```javascript
npm run deploy
// deploy the smartcontract to the chosen network.
```

If you want to deploy to a testnet/mainnet the api and private key have to be configured within hardhat/hardhat.config.ts

💼 You can edit your deployment scripts in `/hardhat/deploy`  
 &nbsp;

Developping in the hardhat network it may be useful to use watch hooks for compiling and deploying, if this is required you can avoid the commands 'compile' and 'deploy' and run in watch mode

```javascript
npm run watch-contract
// launch compile and deploy in watch mode.
```

☠️☠️☠️ Don't do watch mode in mainnet  
⚠️⚠️⚠️ Take care watching in the testnet, test ether is free but you are required to have some  
 &nbsp;  
 **Testing Solidity Contracts**
The schematics also include the hardhat test configuration and infrastructure for solidity contract testing  
 &nbsp;

```javascript
npm run contracts:test
// run the contract tests
```

```javascript
npm run contracts:coverage
// Contracts solidity test coverage analysis
```

&nbsp;
