import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nft-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tokens= [1,2]
  constructor() { }

  ngOnInit(): void {
  }

}
