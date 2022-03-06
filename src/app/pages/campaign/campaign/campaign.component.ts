import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { address_0, DappInjectorService, NotifierService, randomString, Web3Actions, web3Selectors } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { IGRATITUDE_CAMPAIGN } from 'src/app/shared/models/general';
import { ThegraphService } from 'src/app/shared/services/thegraph.service';


import { IpfsService } from '../../ipfs/ipfs-service';
import { CreateCampaignComponent } from '../create-campaign/create-campaign.component';


@Component({
  selector: 'campaign-gratitude',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements AfterViewInit {
  campaignForm: any;
  currentPage = 1
  currentPageMy = 1
  itemsPerPage = 2;
  selectedIndex = 1;
  load_more = true;
  load_more_my = true;
  campaigns: Array<IGRATITUDE_CAMPAIGN> = [];
  my_campaigns: Array<IGRATITUDE_CAMPAIGN> = [];
  show_mint_success: boolean;
  gratitudeContract: Contract;
  blockchain_status: unknown;
  location: any;
  router: any;
  constructor(
    private thegraphService: ThegraphService,
    private store: Store,
    private cd: ChangeDetectorRef,
    public ipfsService: IpfsService,
    private dappInjectorService: DappInjectorService,
    public formBuilder: FormBuilder,
    private notifierService: NotifierService,
    public dialog: MatDialog, private modalService: NgbModal
  ) {


  }
  async openDialog() {
    const modalRef = this.modalService.open(CreateCampaignComponent);
    // const dialogRef = this.dialog.open(TransactionComponent, {
    // //   width: '80%',
    // //   maxWidth: '400px',
    // //   data: {},
    // });

    const result = await modalRef.closed.toPromise()

    // const result = await dialogRef.afterClosed().toPromise()
    return result
  }


  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;

      this.getAllCampaigns()

      if (value == 'success') {
        this.gratitudeContract = this.dappInjectorService.config.contracts['myContract'].contract
        this.asyncStuff()
       const signer =   this.dappInjectorService.config.signer;
       console.log(signer)
      } else {

      }

    });

  }

  async getAllCampaigns() {

    const result = await this.thegraphService.querySubgraph(`
  query {
    gratitudeCampaigns(first: ${this.itemsPerPage}, skip: ${(this.currentPage - 1) * this.itemsPerPage}) {
      id
      campaignUri
      campaign_creator
      name
      status
    }
  }
`)


    for (const campaign of result.gratitudeCampaigns) {
      const status = campaign.status;
      // console.log(token.tokenUri)
      const campaignUri = campaign.campaignUri.toString().replace('https://ipfs.io/ipfs/', '');;

      await this.ipfsService.init()
      const ipfs_json = await this.ipfsService.getFileJSON(campaignUri)
      console.log(ipfs_json)

      this.campaigns.push({ ...ipfs_json, ...{ status, campaign_creator: campaign.campaign_creator } });


    }
    console.log(this.campaigns.length)

    if (this.campaigns.length == this.currentPage * this.itemsPerPage) {
      this.load_more = true
    } else {
      this.load_more = false
    }


  }

  async getMyCampaigns() {
    const myAddresse = await this.dappInjectorService.config.signer.getAddress()
    console.log(myAddresse)
    const result = await this.thegraphService.querySubgraph(`
        query {
          gratitudeCampaigns(first: ${this.itemsPerPage}, skip: ${(this.currentPageMy - 1) * this.itemsPerPage}, where: {
            campaign_creator: "${myAddresse}",
            }) {
            id
            campaignUri
            campaign_creator
            name
            status
          }
        }
      `)

      console.log(result)

    for (const campaign of result.gratitudeCampaigns) {
      const status = campaign.status;
      // console.log(token.tokenUri)
      const campaignUri = campaign.campaignUri.toString().replace('https://ipfs.io/ipfs/', '');;

      await this.ipfsService.init()
      const ipfs_json = await this.ipfsService.getFileJSON(campaignUri)


      this.my_campaigns.push({ ...ipfs_json, ...{ status, campaign_creator: campaign.campaign_creator } });


    }
  

    if (this.my_campaigns.length == this.currentPageMy * this.itemsPerPage) {
      this.load_more_my = true
    } else {
      this.load_more_my = false
    }


  }


  showMore() {
    this.currentPage ++;
    this.getAllCampaigns()
  }

  showMoreMy() {
    this.currentPageMy ++;
    this.getAllMyCampaigns()
  }
  getAllMyCampaigns() {
    throw new Error('Method not implemented.');
  }

  async asyncStuff() {
    await this.ipfsService.init()
    this.getMyCampaigns()
  }


  ngOnInit(): void {
  }

}
