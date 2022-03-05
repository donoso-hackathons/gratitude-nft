import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Contract, Signer, Wallet } from 'ethers';
import { providers } from 'ethers';
import { AngularContract } from './classes';
import { NotifierService } from './components';
import { Web3ModalComponent } from './components/web3-modal/web3-modal/web3-modal.component';
import { netWorkById, NETWORKS } from './constants/constants';
import { startUpConfig } from './dapp-injector.module';

import { uniswap_abi } from './helpers/uniswap_abi';
import { ICONTRACT, ICONTRACT_METADATA, ISTARTUP_CONFIG, ITRANSACTION_DETAILS, ITRANSACTION_RESULT } from './models';
import { Web3Actions, web3Selectors } from './store';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';

@Injectable({
  providedIn: 'root',
})
export class DappInjectorService {
  private _dollarExchange!: number;
  config!: ISTARTUP_CONFIG;
  webModal!: Web3ModalComponent;
  contractHeader: ICONTRACT;
  constructor(
    @Inject(DOCUMENT) private readonly document: any,
    @Inject('nftContractMetadata')
    public contractMetadata: ICONTRACT_METADATA,
    private store: Store,
    private notifierService: NotifierService
  ) {
    //this.store
    this.initChain();


  }

  async createProvider(url_array: string[]) {
    let provider;
    if (url_array.length == 0) {
      provider = new providers.JsonRpcProvider();
    } else {
      const p_race = await Promise.race(
        url_array.map((map) => new providers.JsonRpcProvider(map))
      );
      provider = await p_race;
    }

    //this._signer = this._provider.getSigner();
    return provider;
  }

  async getDollarEther() {
    if (this._dollarExchange == undefined) {
      const uniswapUsdcAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';
      const uniswapAbi = uniswap_abi;

      const uniswapService = await this.createProvider([
        'https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406',
        `https://eth-mainnet.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF`,
        'https://rpc.scaffoldeth.io:48544',
      ]);

      const getUniswapContract = async (address: string) =>
        await new Contract(address, uniswapAbi, uniswapService);
      const contract = await getUniswapContract(uniswapUsdcAddress);
      const reserves = await contract['getReserves']();

      this._dollarExchange =
        (Number(reserves._reserve0) / Number(reserves._reserve1)) * 1e12;
    }
    return this._dollarExchange;
  }

  async runfunction(payload: {
    contractKey: string;
    method: string;
    args: any;
  }) {
    let notification_message: ITRANSACTION_RESULT = {
      success: false,
    };

    let transaction_details: ITRANSACTION_DETAILS = {
      txhash: '',
      bknr: 0,
      from: '',
      gas: '',
      to: '',
      value: '',
    };

    ///// Check if method is available within abi
    const abi_record_array = this.config.contracts[
      payload.contractKey
    ].abi.filter((fil) => fil.name == payload.method);

    if (abi_record_array.length !== 1) {
      throw new Error('Method not found');
    }

    const methodAbi = abi_record_array[0];
    const stateMutability = methodAbi.stateMutability;

    const isTransaction =
      stateMutability == 'view' || stateMutability == 'pure' ? false : true;

    try {
      switch (isTransaction) {
        case false:
          console.log('i am viewing');
          const resultFunction = await this.config.contracts[
            payload.contractKey
          ].contract[payload.method].apply(this, payload.args);
          notification_message.success = true;
          return { msg: notification_message, payload: resultFunction };

        default:
          console.log('i am gasing');
          const result_tx = await this.config.contracts[
            payload.contractKey
          ].contract[payload.method].apply(this, payload.args);
          const resultTransaction = await result_tx.wait();
          transaction_details.txhash = resultTransaction.transactionHash;
          transaction_details.from = resultTransaction.from;
          transaction_details.to = resultTransaction.to;
          transaction_details.gas = resultTransaction.gasUsed;
          transaction_details.bknr = resultTransaction.blockNumber;

          result_tx.value == undefined
            ? (transaction_details.value = '0')
            : (transaction_details.value = result_tx.value.toString());
          notification_message.success = true;
          notification_message.success_result = transaction_details;
          return { msg: notification_message, payload: undefined };
      }
    } catch (e: any) {
      console.log(e);
      // Accounts for Metamask and default signer on all networks
      let myMessage =
        e.data && e.data.message
          ? e.data.message
          : e.error && JSON.parse(JSON.stringify(e.error)).body
          ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
          : e.data
          ? e.data
          : JSON.stringify(e);
      if (!e.error && e.message) {
        myMessage = e.message;
      }

      try {
        let obj = JSON.parse(myMessage);
        if (obj && obj.body) {
          let errorObj = JSON.parse(obj.body);
          if (errorObj && errorObj.error && errorObj.error.message) {
            myMessage = errorObj.error.message;
          }
        }
      } catch (e) {
        //ignore
      }
      notification_message.error_message = myMessage;
      return { msg: notification_message, payload: undefined };
    }
  }

  async goScan(){

  }

  async doFaucet(tx: any): Promise<any| void> {
    let tx_obj;
    console.log(tx)
 
   
  }

  async handleContractError(e:any) {
    // console.log(e);
    // Accounts for Metamask and default signer on all networks
    let myMessage =
      e.data && e.data.message
        ? e.data.message
        : e.error && JSON.parse(JSON.stringify(e.error)).body
        ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
        : e.data
        ? e.data
        : JSON.stringify(e);
    if (!e.error && e.message) {
      myMessage = e.message;
    }

    try {
      let obj = JSON.parse(myMessage);
      if (obj && obj.body) {
        let errorObj = JSON.parse(obj.body);
        if (errorObj && errorObj.error && errorObj.error.message) {
          myMessage = errorObj.error.message;
        }
      }
    } catch (e) {
      //ignore
    }

   return  myMessage;
  }

  async doTransaction(tx: any, signer?:any) {
    let notification_message: ITRANSACTION_RESULT = {
      success: false,
    };

    let transaction_details: ITRANSACTION_DETAILS = {
      txhash: '',
      bknr: 0,
      from: '',
      gas: '',
      to: '',
      value: '',
    };
    try {

    let tx_obj;

      if (!signer) {
        tx_obj = await this.config.signer!.sendTransaction(tx);
      } else {
        tx_obj = await signer.sendTransaction(tx);
      }

     
    

      let tx_result = await tx_obj.wait();
      const balance: any = await this.config.signer?.getBalance();
      this.store.dispatch(
        Web3Actions.updateWalletBalance({ walletBalance: balance })
      );

      const result = tx_result;
      transaction_details.txhash = result.transactionHash;
      transaction_details.from = result.from;
      transaction_details.to = result.to;
      transaction_details.gas = result.gasUsed.toString();
      transaction_details.bknr = result.blockNumber;

      tx_obj.value == undefined
        ? (transaction_details.value = '0')
        : (transaction_details.value = tx_obj.value.toString());
      notification_message.success = true;
      notification_message.success_result = transaction_details;
    } catch (e: any) {
      // console.log(e);
      // Accounts for Metamask and default signer on all networks
      let myMessage =
        e.data && e.data.message
          ? e.data.message
          : e.error && JSON.parse(JSON.stringify(e.error)).body
          ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
          : e.data
          ? e.data
          : JSON.stringify(e);
      if (!e.error && e.message) {
        myMessage = e.message;
      }

      try {
        let obj = JSON.parse(myMessage);
        if (obj && obj.body) {
          let errorObj = JSON.parse(obj.body);
          if (errorObj && errorObj.error && errorObj.error.message) {
            myMessage = errorObj.error.message;
          }
        }
      } catch (e) {
        //ignore
      }

      notification_message.error_message = myMessage;
    }

    return notification_message;
  }

  async dispatchInit(dispatchObject: {
    signer: Signer;
    provider: JsonRpcProvider | Web3Provider;
  }) {
    this.config.signer = dispatchObject.signer;
    this.config.providers['main'] = dispatchObject.provider;

    const contract = new AngularContract({
      metadata: this.contractMetadata,
      provider: dispatchObject.provider,
      signer: dispatchObject.signer,
    });

    this.config.contracts['myContract'] = contract;

    this.contractHeader = {
      name: contract.name,
      address: contract.address,
      abi: contract.abi,
      network: contract.network,
    };



    await this.getDollarEther();
    this.store.dispatch(
      Web3Actions.setDollarExhange({ exchange: this._dollarExchange })
    );

    const providerNetwork = await dispatchObject.provider.getNetwork();

    const networkString = netWorkById(providerNetwork.chainId)?.name as string;
    console.log(networkString);
    this.config.connectedNetwork = networkString;
    this.store.dispatch(
      Web3Actions.setSignerNetwork({ network: networkString })
    );

    console.log('success');

    this.store.dispatch(Web3Actions.chainStatus({ status: 'success' }));
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async launchWenmodal() {

    if (this.config.defaultNetwork == 'localhost') {
      this.connectLocalWallet()
    } else {
      await this.webModal.connectWallet();
    }


  }

async connectLocalWallet(){
  this.store.dispatch(Web3Actions.chainBusy({ status: true}));
  try {
    const hardhatProvider = await this.createProvider([
      NETWORKS[this.config.defaultNetwork].rpcUrl,
    ]);

    let wallet: Wallet;

    switch (this.config.wallet) {
      case 'burner':
        const currentPrivateKey =
          window.localStorage.getItem('metaPrivateKey');
        if (currentPrivateKey) {
          wallet = new Wallet(currentPrivateKey);
        } else {
          wallet = Wallet.createRandom();
          const privateKey = wallet._signingKey().privateKey;
          window.localStorage.setItem('metaPrivateKey', privateKey);
        }
        break;

      default:
        let privKey = ''; //environment.privKey
        wallet = new Wallet(privKey);
        break;
    }

    ////// local wallet
    const hardhatSigner = await wallet.connect(hardhatProvider);
 
    this.dispatchInit({ signer: hardhatSigner, provider: hardhatProvider });
  } catch (error: any) {
    console.log(error);

    this.notifierService.showNotificationTransaction({
      success: false,
      error_message: error.toString(),
    });
    this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }
}

  async initChain() {
    this.config = startUpConfig;

    

    const hardhatProvider = await this.createProvider([
      NETWORKS[this.config.defaultNetwork].rpcUrl,
    ]);

    this.config.defaultProvider = hardhatProvider;

    if (this.config.wallet == 'wallet') {
      console.log('Check if 🦊 injected provider');
     let ethereum = (window as any).ethereum;
      if (!!(window as any).ethereum) {
        const metamaskProvider = new providers.Web3Provider(ethereum, 'any');

        const addresses = await metamaskProvider.listAccounts();
        console.log(addresses);
        if (addresses.length > 0) {
          const providerNetwork =
            metamaskProvider && (await metamaskProvider.getNetwork());
          const metamaskSigner = await metamaskProvider.getSigner();

          this.dispatchInit({
            signer: metamaskSigner,
            provider: metamaskProvider,
          });

          this.webModal = new Web3ModalComponent({
            document: this.document,
            provider: ethereum,
          }, this.store);
        } else {
          this.webModal = new Web3ModalComponent({ document: this.document },this.store);
          this.store.dispatch(
            Web3Actions.chainStatus({ status: 'ethereum-not-connected' })
          );
          this.store.dispatch(Web3Actions.chainBusy({ status: false }));
          console.log('ethereum no connecte');
        }
      } else {
        this.webModal = new Web3ModalComponent({ document: this.document }, this.store);
        this.store.dispatch(
          Web3Actions.chainStatus({ status: 'wallet-not-connected' })
        );
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        console.log('wallet no connecte');
      }
      await this.webModal.loadWallets();
      this.webModal.onConnect.subscribe(async (walletConnectProvider) => {
        this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
        this.store.dispatch(Web3Actions.chainBusy({ status: true }));

        const webModalProvider = new providers.Web3Provider(
          walletConnectProvider
        );
        const webModalSigner = await webModalProvider.getSigner();
        this.dispatchInit({
          signer: webModalSigner,
          provider: webModalProvider,
        });
      });

      this.webModal.onDisConnect.subscribe(() => {
        console.log('i am disconnecting')
        this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      });
    } else {
      this.connectLocalWallet();
      // this.store.dispatch(Web3Actions.chainStatus({ status: 'disconnected' }));
      // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.store.pipe(web3Selectors.pleaseDisconnect).subscribe(()=> {
        console.log('i amdisconencting manually')
        this.store.dispatch(Web3Actions.chainStatus({ status: 'disconnected' }));
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        this.config.signer = undefined;
        this.config.contracts = {};

      })
    }
  }
}
