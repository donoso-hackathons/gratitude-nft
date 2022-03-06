import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { address_0, DappInjectorService, NotifierService, randomString, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';


import { IpfsService } from '../../ipfs/ipfs-service';

export interface IGRATITUDE_CAMPAIGN_JSON {
  type: 'text',
  description:string,
  name:string,
  campaign_creator:string,
  ipfsFileUrl?:string // Needed in case grattude nft not only text
}

@Component({
  selector: 'campaign-gratitude',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements AfterViewInit {
  campaignForm: any;
  show_mint_success: boolean;
  gratitudeContract: Contract;
  constructor(
    private store:Store,
    private cd:ChangeDetectorRef,
    public ipfsService: IpfsService, 
    private dappInjectorService:DappInjectorService,
    public formBuilder: FormBuilder,
    private notifierService: NotifierService,) {

    const len = address_0.length;

    this.campaignForm = this.formBuilder.group({
      nameCtrl: ['', [Validators.required, Validators.maxLength(20)]],
      descriptionCtrl: [
        '', [Validators.maxLength(200)]
      ],
      phoneCtrl:['',Validators.required],
      webCtrl:['',Validators.required],
     // locationCtrl: [true],
      addressCtrl: ['',[Validators.maxLength(len),Validators.minLength(len)]]
    });
  }
  ngAfterViewInit(): void {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract
    this.asyncStuff()
  }

  async asyncStuff(){
   await this.ipfsService.init()
  }


  async mintCampaign() {

  
  
   
   if (this.campaignForm.valid == false){
  
     return
   }
  
  
  
  
    const name = this.campaignForm.controls['nameCtrl'].value;
    const description = this.campaignForm.controls['descriptionCtrl'].value;
    const address_creator = this.campaignForm.controls['addressCtrl'].value;
    //const checklocation = this.campaignForm.controls['locationCtrl'].value
  
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  
   const geo = {lat:'nop', lng:'nop'}
  
    // if (this.campaignForm.controls['locationCtrl'].value == true){
    //   const f =  await this.commonForm.getCoords();
    //   if (f.available == true){
    //     geo.lat= f.lat.toString()
    //     geo.lng = f.lng.toString();
    //   }
    
    //  }
    
  
  
    let tokenUri;
  
    try {
  
  

  
    //// 2- CREATING  IPFS JSON
      const ipfsJson: IGRATITUDE_CAMPAIGN_JSON = {
          type:'text',
          ipfsFileUrl: 'ipfs_url',
          campaign_creator:address_creator,
          name:name,
          description:description
      }
  
      console.log(ipfsJson)

   //// 3- UPLOADING IPFS JSON AND getting tokenURI
      const result_ipfsJson = await this.ipfsService.add(JSON.stringify(ipfsJson));
      tokenUri = `${result_ipfsJson.path}`
  
      console.log(ipfsJson)
      
    } catch (error) {
      console.log(error)
      this.notifierService.showNotificationTransaction({success:false, error_message:' Problems woth IPFS'});
      
      this.store.dispatch(Web3Actions.chainBusy({ status: false}));
    }
  
  
  
    //// 4- Minting token with adress_o (it means we do not know the receiver)
    try {
  
  
  
     const timestamp = Math.ceil((new Date().getTime())/1000)
     const linkCode = randomString(10)
     const result_mint = await this.gratitudeContract.createCampaign(name,tokenUri,
        { gasPrice: utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 })
     const tx =  await result_mint.wait();
    
    // await this.notifierService.showNotificationTransaction({success:true, success_message: 'NFT Minted!!'});
     this.store.dispatch(Web3Actions.chainBusy({ status: false }));
     this.show_mint_success = true
    //  this.show_mint_code = `${environment.host}/inbox-gratitude/${linkCode}`
    //  this.router.navigateByUrl('/dashboard')
  
  
          
    } catch (error) {
      const error_message = await this.dappInjectorService.handleContractError(error);
      this.notifierService.showNotificationTransaction({success:false, error_message: error_message});
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      
    }
      
   
  
  
    }

  ngOnInit(): void {
  }

}
