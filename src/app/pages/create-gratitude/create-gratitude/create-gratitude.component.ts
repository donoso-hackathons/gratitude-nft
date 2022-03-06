import { Component, OnInit } from '@angular/core';
import { DappInjectorService, NotifierService,Web3Actions,address_0,randomString } from 'angular-web3';
import { IpfsService } from '../../ipfs/ipfs-service';
import {IGRATITUDE_IPFS_JSON} from 'src/app/shared/models/general';
import { Store } from '@ngrx/store';
import { Contract, utils } from 'ethers';


@Component({
  selector: 'create-gratitude',
  templateUrl: './create-gratitude.component.html',
  styleUrls: ['./create-gratitude.component.scss']
})
export class CreateGratitudeComponent implements OnInit {
  static image(image: any) {
    throw new Error('Method not implemented.');
  }
  gratitudeContract: Contract;
  details = {
    name:'',
    gratitude:'',
  }
  imageUrl:string;
  tokenUri :string;
  loading: boolean;
  private _myIPService: any;
  IppDetails: any;
  errorMessage: any;
  constructor(private dappInjectorService:DappInjectorService,private ipfsService:IpfsService,private store:Store,private notifierService: NotifierService,) { }

  ngOnInit(): void {
  // const myContract = this.dappInjectorService.config.contracts['myContract'].runFunction('mint',[])
  this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract
  }

getIP() {
    this.loading = true;
    this._myIPService.getIP()
    .subscribe(
        IPDetails => this.IppDetails,
        error =>  this.errorMessage = <any>error
        );
}

  onFileUpload(event){
    const file: File = event.target.files[0];
    console.log(file,"fileeeee");
    const reader = new FileReader();

    reader.addEventListener('load', async (event: any) => {
      const buf = Buffer.from(reader.result as ArrayBuffer)
     try {
      const result = await this.ipfsService.add(buf);
      console.log(result)
      console.log(`https://ipfs.io/ipfs/${result.path}`)
      this.imageUrl = `https://ipfs.io/ipfs/${result.path}`;
      this.image=this.imageUrl;
      console.log(this.imageUrl,"imageeeeeeee");
     } catch (error) {
       console.log(error,"errorrr");
       alert("Error Uploadig file");
     }

      });

      reader.readAsArrayBuffer(file);
  }

  async uploadJson() {
    const json = {
      name: this.details.name,
      image: this.imageUrl,
      gratitude: this.details.gratitude
    }
    const result = await this.ipfsService.add(
      JSON.stringify(json)
    );

    if (result && result.path) {
      this.tokenUri = result.path;
      console.log(this.tokenUri,"tokenuriiiiiiii");
    }
  }


  async submitNft() {
    //Upload Files to IPFS & Mint NFT
    const {name,gratitude} = this.details;
    if (name&&gratitude && this.imageUrl){
     await this.mintNft();
    }else{
      alert(`
    Name: ${this.details.name}
    Gratitude: ${this.details.gratitude}
    `);
    }

  }


  async mintNft() {

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    let tokenUri;

    try {


    //// 2- CREATING  IPFS JSON
      const ipfsJson: IGRATITUDE_IPFS_JSON = {
          type:'image',
          ipfsFileUrl: this.imageUrl,
          senderName:this.details.name,
          description:this.details.gratitude,
      }

      console.log(JSON.stringify(ipfsJson),"json");

   //// 3- UPLOADING IPFS JSON AND getting tokenURI
      const result_ipfsJson = await this.ipfsService.add(JSON.stringify(ipfsJson));
      this.tokenUri = `https://ipfs.io/ipfs/${result_ipfsJson.path}`
      console.log(this.tokenUri,"uriiiiiiii");


    } catch (error) {
      console.log(error,"errorrrrrr");
      this.notifierService.showNotificationTransaction({success:false, error_message:' Problems with IPFS'});

      this.store.dispatch(Web3Actions.chainBusy({ status: false}));
    }



    //// 4- Minting token with adress_o (it means we do not know the receiver)
    try {



     const timestamp = Math.ceil((new Date().getTime())/1000)
     const linkCode = randomString(10)
     const result_mint = await this.gratitudeContract.createGratitudeToken(1, address_0, {lat:500, lng:500}, timestamp, this.tokenUri, linkCode
      ,{ gasPrice: utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 })
     const tx =  await result_mint.wait();
     console.log(tx,"transactionnnn")

     await this.notifierService.showNotificationTransaction({success:true, success_message: 'NFT Minted!!'});
     this.store.dispatch(Web3Actions.chainBusy({ status: false }));
     //this.router.navigateByUrl('/dashboard')



    } catch (error) {
      console.log(error,"error minting")
      const error_message = await this.dappInjectorService.handleContractError(error);
      this.notifierService.showNotificationTransaction({success:false, error_message: error_message});
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));

    }




  }



  isFilter: boolean = false;
  isFilter2: boolean = false;
  isFilter3: boolean = false;

  clickEvent(){
    this.isFilter = !this.isFilter;
}
  clickEvent2(){
    this.isFilter2 = !this.isFilter2;
}
  clickEvent3(){
    this.isFilter3 = !this.isFilter3;
  }

  image: any = 'https://robohash.org/' + randomString(15);
  temp1() {
    this.image = 'https://img.freepik.com/free-vector/thank-you-composition-comic-style_23-2147828808.jpg?w=740';
}
  temp2() {
  this.image = 'https://robohash.org/honey?set=set2'
}
  temp3() {
  this.image = 'https://robohash.org/honey?set=set4'
  }
  temp4() {
  this.image = 'https://img.freepik.com/free-vector/cute-unicorn-with-birthday-cake-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3362.jpg?w=740'
  }
  temp5() {
  this.image = 'https://img.freepik.com/free-vector/cartoon-great-job-stickers-collection_23-2148928582.jpg?w=900'
  }
  temp6() {
  this.image = 'https://robohash.org/' + randomString(10);
  }


  // random image https://source.unsplash.com/user/c_v_r

    }

var canvas = document.createElement('canvas');
canvas.id = "canvasPhoto";
var ctx = canvas.getContext('2d');
var Image: new (width?: number, height?: number) => HTMLImageElement
ctx.drawImage(Image.arguments, 0, 0)
