import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { address_0, DappInjectorService, NotifierService, randomString, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { IGRATITUDE_IPFS_JSON } from 'src/app/shared/models/general';
import { environment } from 'src/environments/environment';
import { IpfsService } from '../../ipfs/ipfs-service';
import { CommonFormComponent } from '../common-form/common-form.component';

@Component({
  selector: 'create-take-photo',
  templateUrl: './create-take-photo.component.html',
  styleUrls: ['./create-take-photo.component.scss'],
})
export class CreateTakePhotoComponent implements AfterViewInit {
  gratitudeContract: Contract;
  show_mint_code: string;
  show_mint_success = false;

  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();



constructor(
  private store:Store,
  private cd:ChangeDetectorRef,
  public ipfsService: IpfsService, 
  private dappInjectorService:DappInjectorService,
  private notifierService: NotifierService,
  private router: Router) {

}

@ViewChild('commonForm') public commonForm: CommonFormComponent;

  ngAfterViewInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract
  }


  close(){
    console.log('i am closing')
    this.show_mint_success = false
    this.router.navigateByUrl('/dashboard')
  }

 async mintNft() {
  this.cd.detectChanges();


 
 if (this.commonForm.commonForm.valid == false){

   return
 }




  const name = this.commonForm.commonForm.controls['nameCtrl'].value;
  const description = this.commonForm.commonForm.controls['descriptionCtrl'].value;
  //const checklocation = this.commonForm.commonForm.controls['locationCtrl'].value

  this.store.dispatch(Web3Actions.chainBusy({ status: true }));

 const geo = {lat:'nop', lng:'nop'}

  // if (this.commonForm.commonForm.controls['locationCtrl'].value == true){
  //   const f =  await this.commonForm.getCoords();
  //   if (f.available == true){
  //     geo.lat= f.lat.toString()
  //     geo.lng = f.lng.toString();
  //   }
  
  //  }
  


  let tokenUri;

  try {


    /// 1 - ADDING BASE64string image to IPFS
    const result = await this.ipfsService.add(this.webcamImage.imageAsDataUrl);
    console.log(`https://ipfs.io/ipfs/${result.path}`)
    const ipfs_url = result.path;
    

  //// 2- CREATING  IPFS JSON
    const ipfsJson: IGRATITUDE_IPFS_JSON = {
        type:'image',
        ipfsFileUrl: ipfs_url,
        senderName:name,
        description:description
    }

 //// 3- UPLOADING IPFS JSON AND getting tokenURI
    const result_ipfsJson = await this.ipfsService.add(JSON.stringify(ipfsJson));
    tokenUri = `https://ipfs.io/ipfs/${result_ipfsJson.path}`


    
  } catch (error) {
    this.notifierService.showNotificationTransaction({success:false, error_message:' Problems woth IPFS'});
  
    this.store.dispatch(Web3Actions.chainBusy({ status: false}));
  }



  //// 4- Minting token with adress_o (it means we do not know the receiver)
  try {
    let adressto_push = address_0
    if (this.commonForm.option == 1){
      adressto_push = this.commonForm.commonForm.controls['addressCtrl'].value;
    }

   const timestamp = Math.ceil((new Date().getTime())/1000)
   const linkCode = randomString(10)
   const result_mint = await this.gratitudeContract.createGratitudeToken(1, adressto_push , geo, timestamp, tokenUri, linkCode, 
      { gasPrice: utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 })
   const tx =  await result_mint.wait();
  
  // await this.notifierService.showNotificationTransaction({success:true, success_message: 'NFT Minted!!'});
   this.store.dispatch(Web3Actions.chainBusy({ status: false }));
   this.show_mint_success = true
   this.show_mint_code = `${environment.host}/inbox-gratitude/${linkCode}`
  // this.router.navigateByUrl('/dashboard')


        
  } catch (error) {
    const error_message = await this.dappInjectorService.handleContractError(error);
    this.notifierService.showNotificationTransaction({success:false, error_message: error_message});
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    
  }
    
 


  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.cd.detectChanges();
  }

async  toggleWebcam(){
  // const timestamp = Math.ceil((new Date().getTime())/1000)
  // const linkCode = randomString(10)

  //   const result_mint = await this.gratitudeContract.createGratitudeToken(1, adress_0, {lat:500, lng:500}, timestamp, 'tokenUri', linkCode, 
  //   { gasPrice: utils.parseUnits('1', 'gwei'), 
  //     gasLimit: 2000000 })
  //   const tx =  await result_mint.wait();
   this.showWebcam = !this.showWebcam;
   this.cd.detectChanges();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.showWebcam = false;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
