import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, NotifierService } from 'angular-web3';
import { Contract } from 'ethers';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'create-record-audio',
  templateUrl: './create-record-audio.component.html',
  styleUrls: ['./create-record-audio.component.scss']
})
export class CreateRecordAudioComponent implements AfterViewInit {
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
