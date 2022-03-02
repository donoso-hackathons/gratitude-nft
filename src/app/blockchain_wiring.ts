
import { InjectionToken } from '@angular/core';


import NftContractMetadata from  '../assets/contracts/gratitude_contract_metadata.json';




export const blockchain_providers = [ {provide: 'nftContractMetadata', useValue: NftContractMetadata},
]

////// Common Components Wirings
import { ContractShowModule, AddressShowModule, BlockchainModule, DialogModule, NotifierModule, DebugComponentModule } from 'angular-web3';
export const blockchain_imports =  [DebugComponentModule,  ContractShowModule,AddressShowModule,BlockchainModule,DialogModule,NotifierModule]
