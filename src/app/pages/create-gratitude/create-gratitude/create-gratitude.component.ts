import { Component, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';

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
  constructor(private dappInjectorService:DappInjectorService) { }

  ngOnInit(): void {
  // const myContract = this.dappInjectorService.config.contracts['myContract'].runFunction('mint',[])
  }
  submitNft(): void {
    //Upload Files to IPFS & Mint NFT
    const {name,gratitude} = this.details;
    if (name&&gratitude)
    alert(`
    Name: ${this.details.name}
    Gratitude: ${this.details.gratitude}
    `);
  }
}
