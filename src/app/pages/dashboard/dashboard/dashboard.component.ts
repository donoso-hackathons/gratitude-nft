import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, web3Selectors } from 'angular-web3';
import { Contract } from 'ethers';
import { IGRATITUDE_NFT } from 'src/app/shared/models/general';
import { ThegraphService } from 'src/app/shared/services/thegraph.service';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'nft-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
 
  
  currentPage = 1
  currentPageReceive = 1
  itemsPerPage = 2;
  selectedIndex = 0;
  load_more =false;
  load_more_receive = false;

  tokens: Array<IGRATITUDE_NFT> = [];
  tokens_receive: Array<IGRATITUDE_NFT> = [];

  gratitudeContract: Contract;
  blockchain_status: string;
  myaddresse: string;
  constructor(
   private store:Store,
    private dappInjectorService:DappInjectorService,
    public ipfsService: IpfsService,
    public router:Router,
    public thegraphService: ThegraphService
    ) { }

    async getReceivedTokens() {

      const result = await this.thegraphService.querySubgraph(`
      query {
      gratitudeTokens(first: ${this.itemsPerPage}, skip: ${(this.currentPageReceive - 1) * this.itemsPerPage}, where: {
        receiver: "${this.myaddresse}"
        status_in: [1,4]
        })
    {
      id
      status
      tokenUri
      sender
      receiver
    }
    }
  `)
  
  
      for (const token of result.gratitudeTokens) {
        console.log(token);
        const status = token.status;
        // console.log(token.tokenUri)
        const campaignUri = token.tokenUri.toString().replace('https://ipfs.io/ipfs/', '');;
  
        await this.ipfsService.init()
        const ipfs_json = await this.ipfsService.getFileJSON(campaignUri)
        console.log(ipfs_json)
  
        this.tokens_receive.push(  {...ipfs_json,...{ status,tokenId:token.id}});
      
  
      }
      console.log(this.tokens_receive.length)
  
      if (this.tokens_receive.length == this.currentPageReceive * this.itemsPerPage) {
        this.load_more_receive = true
      } else {
        this.load_more_receive = false
      }
  
  
    }
  
    async getmyTokens() {

      const result = await this.thegraphService.querySubgraph(`
      query {
      gratitudeTokens(first: ${this.itemsPerPage}, skip: ${(this.currentPage - 1) * this.itemsPerPage}, where: {
        sender: "${this.myaddresse}"
        })
    {
      id
      status
      tokenUri
      sender
      receiver
    }
    }
  `)
  
  
      for (const token of result.gratitudeTokens) {
        console.log(token);
        const status = token.status;
        // console.log(token.tokenUri)
        const campaignUri = token.tokenUri.toString().replace('https://ipfs.io/ipfs/', '');;
  
        await this.ipfsService.init()
        const ipfs_json = await this.ipfsService.getFileJSON(campaignUri)
        console.log(ipfs_json)
  
        this.tokens.push(  {...ipfs_json,...{ status,tokenId:token.id}});
      
  
      }
      console.log(this.tokens.length)
  
      if (this.tokens.length == this.currentPageReceive * this.itemsPerPage) {
        this.load_more = true
      } else {
        this.load_more  = false
      }
  
  
    }
  
    // async getMyTokens() {
    //   const myAddresse = await this.dappInjectorService.config.signer.getAddress()
    //   console.log(myAddresse)
    //   const result = await this.thegraphService.querySubgraph(`
    //       query {
    //         gratitudeCampaigns(first: ${this.itemsPerPage}, skip: ${(this.currentPageMy - 1) * this.itemsPerPage}, where: {
    //           campaign_creator: "${myAddresse}",
    //           }) {
    //           id
    //           campaignUri
    //           campaign_creator
    //           name
    //           status
    //         }
    //       }
    //     `)
  
    //     console.log(result)
  
    //   for (const campaign of result.gratitudeCampaigns) {
    //     const status = campaign.status;
    //     // console.log(token.tokenUri)
    //     const campaignUri = campaign.campaignUri.toString().replace('https://ipfs.io/ipfs/', '');;
  
    //     await this.ipfsService.init()
    //     const ipfs_json = await this.ipfsService.getFileJSON(campaignUri)
  
        
    //     this.my_campaigns.push({ ...ipfs_json, ...{ status, campaign_creator: campaign.campaign_creator } });
  
  
    //   }
    
  
    //   if (this.my_campaigns.length == this.currentPageMy * this.itemsPerPage) {
    //     this.load_more_my = true
    //   } else {
    //     this.load_more_my = false
    //   }
  
  
    // }
  
  
    showMore() {
      this.currentPage ++;
      this.getmyTokens()
    }
  
    showMoreReceived() {
      this.currentPageReceive ++;
      this.getReceivedTokens()
    }
   


  async getTokens() {



    const gratitude_tokens = await this.gratitudeContract.getCreatorTokens()
    console.log(gratitude_tokens)

    for (const token of gratitude_tokens) {
          const tokenId = token.tokenId;
          const status = token.status;
          console.log(token.tokenUri)
          const tokenUri = token.tokenUri.toString().replace('https://ipfs.io/ipfs/','');;
      
          await this.ipfsService.init()
          const ipfs_json = await this.ipfsService.getFileJSON(tokenUri)
          console.log(ipfs_json)
    
         this.tokens.push({...ipfs_json,...{ status,tokenId}});
    
    }

  }
  createtoken(){
    this.router.navigateByUrl('/master')
  }

  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;

    

      if (value == 'success') {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract;
    this.myaddresse = await (this.dappInjectorService.config.signer.getAddress())
   // this.getTokens()
    this.getReceivedTokens()
    this.getmyTokens()
      }
    })

   

  }
}
