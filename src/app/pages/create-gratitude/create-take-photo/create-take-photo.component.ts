import { AfterViewInit, Component, OnInit } from '@angular/core';
import { adress_0, DappInjectorService, randomString } from 'angular-web3';
import { Contract } from 'ethers';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { IGRATITUDE_IPFS_JSON } from 'src/app/shared/models/general';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'create-take-photo',
  templateUrl: './create-take-photo.component.html',
  styleUrls: ['./create-take-photo.component.scss'],
})
export class CreateTakePhotoComponent implements AfterViewInit {
  gratitudeContract: Contract;

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


constructor(public ipfsService: IpfsService, private dappInjectorService:DappInjectorService,) {

}
  ngAfterViewInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract
  }



 async mintNft() {

    /// 1 - ADDING BASE64string image to IPFS
    const result = await this.ipfsService.add(this.webcamImage.imageAsDataUrl);
    console.log(`https://ipfs.io/ipfs/${result.path}`)
    const ipfs_url = result.path;


  //// 2- CREATING  IPFS JSON
    const ipfsJson: IGRATITUDE_IPFS_JSON = {
        type:'image',
        ipfsFileUrl: ipfs_url,
        senderName:'myname',
        description:'my description'
    }

 //// 3- UPLOADING IPFS JSON AND getting tokenURI
    const result_ipfsJson = await this.ipfsService.add(JSON.stringify(ipfsJson));
    const tokenUri = `https://ipfs.io/ipfs/${result_ipfsJson.path}`



  //// 4- Minting token with adress_o (it means we do not know the receiver)
   const timestamp = Math.ceil((new Date().getTime())/1000)
   const linkCode = randomString(10)
   const result_mint = await this.gratitudeContract.createGratitudeToken(1, adress_0, {lat:500, lng:500}, timestamp, tokenUri, linkCode)
  const tx =  await result_mint.wait();
    console.log(tx)
    
    //// TODO 
    // feedback user and redirecto dashbboars


  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
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
