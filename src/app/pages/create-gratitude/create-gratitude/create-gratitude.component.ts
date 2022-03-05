import { Component, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'create-gratitude',
  templateUrl: './create-gratitude.component.html',
  styleUrls: ['./create-gratitude.component.scss']
})
export class CreateGratitudeComponent implements OnInit {
  details = {
    name:'',
    gratitude:'',
  }
  imageUrl:string;
  tokenUri :string;
  constructor(private dappInjectorService:DappInjectorService,private ipfsService:IpfsService) { }

  ngOnInit(): void {
  // const myContract = this.dappInjectorService.config.contracts['myContract'].runFunction('mint',[])
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
      await this.uploadJson();
      const gratitudeDetails = [1,'0x0000000000000000000000000000000000000000', {lat:0, lng:0}, 12345631, this.tokenUri, '67hghkihy9'];
      const myContract = await this.dappInjectorService.config.contracts['myContract'].runFunction('createGratitudeToken',gratitudeDetails);
      console.log(myContract,"detailsssss");
    }else{
      alert(`
    Name: ${this.details.name}
    Gratitude: ${this.details.gratitude}
    `);
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

  image: any = 'https://images.unsplash.com/photo-1612904370392-d1dde7a8ddc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';
  temp1() {
  this.image = '../../../../assets/images/birthday-g62be367ca_640.png'
}  
  temp2() {
  this.image = '../../../../assets/images/bubbles-g85ef2b58e_1280.png'
}  
  temp3() {
  this.image = '../../../../assets/images/hearts-g1d52ecab5_1280.png'
}  
    }


// image filter

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const image = document.getElementById('source');
// 
// image.addEventListener('load', e => {
//   // Draw unfiltered image
//   ctx.drawImage(image, 0, 0, image.width * .6, image.height * .6);
// 
//   // Draw image with filter
//   ctx.filter = 'contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)';
//   ctx.drawImage(image, 400, 0, -image.width * .6, image.height * .6);
// });