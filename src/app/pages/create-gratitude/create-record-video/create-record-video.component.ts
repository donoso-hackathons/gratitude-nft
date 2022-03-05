import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, NotifierService } from 'angular-web3';
import { Contract } from 'ethers';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'create-record-video',
  templateUrl: './create-record-video.component.html',
  styleUrls: ['./create-record-video.component.scss']
})
export class CreateRecordVideoComponent  implements AfterViewInit {
  gratitudeContract: Contract;
  constructor(
    private store:Store,
    private cd:ChangeDetectorRef,
    public ipfsService: IpfsService, 
    private dappInjectorService:DappInjectorService,
    private notifierService: NotifierService,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract

  }

}
