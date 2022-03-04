import { Component, Input, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';
import { Contract } from 'ethers';
import { IGRATITUDE_NFT } from 'src/app/shared/models/general';

@Component({
  selector: 'token-card',
  templateUrl: './gratitude-token-card.component.html',
  styleUrls: ['./gratitude-token-card.component.scss'],
})
export class GratitudeTokenCardComponent implements OnInit {
  gratitudeContract: Contract;

  constructor(private dappInjectorService: DappInjectorService) {
    this.gratitudeContract =
      this.dappInjectorService.config.contracts['myContract'].contract;
  }
  @Input() gratitudeToken: IGRATITUDE_NFT;
  @Input() linkCode: string;
  @Input() role: 'receiver' | 'creater';
  ngOnInit(): void {}


  reject() {
    if (this.linkCode !== undefined) {
      try {
        const result = this.gratitudeContract.rejectGratitudeNFTbyLinkCode(this.linkCode);
      } catch (error) {
        // TODO Handle error}
      }
    }
  }

  accept() {
    if (this.linkCode !== undefined) {
      try {
        const result = this.gratitudeContract.acceptLinkHash(this.linkCode);
      } catch (error) {
        // TODO Handle error}
      }
    }
  }
}
