import { Component, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';

@Component({
  selector: 'dapp-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private dappInjectorService:DappInjectorService) { }

  ngOnInit(): void {
  }

  connect(){
    this.dappInjectorService.launchWenmodal()
  }

}
