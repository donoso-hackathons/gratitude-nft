import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, NotifierService } from 'angular-web3';
import { Contract } from 'ethers';
import { IpfsService } from '../../ipfs/ipfs-service';

declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'create-record-audio',
  templateUrl: './create-record-audio.component.html',
  styleUrls: ['./create-record-audio.component.scss']
})
export class CreateRecordAudioComponent implements AfterViewInit {
  gratitudeContract: Contract;
  title = 'micRecorder';
  constructor(
    private store:Store,
    private cd:ChangeDetectorRef,
    public ipfsService: IpfsService, 
    private dappInjectorService:DappInjectorService,
    private notifierService: NotifierService,
    private domSanitizer: DomSanitizer,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract


    
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  // .then(stream => {
  //   const mediaRecorder = new MediaRecorder(stream);
  //   mediaRecorder.start();
  // });
 
  }

//Lets declare Record OBJ
record;
//Will use this flag for toggeling recording
recording = false;
//URL of Blob
url;
error;
constr
  
sanitize(url: string) {
return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  
  /**
* Start recording.
*/
initiateRecording() {
this.recording = true;
let mediaConstraints = {
video: false,
audio: true
};
navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
}
/**
* Will be called automatically.
*/
successCallback(stream) {
var options = {
mimeType: "audio/wav",
numberOfAudioChannels: 1,
sampleRate: 16000,
};
//Start Actuall Recording
var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
this.record = new StereoAudioRecorder(stream, options);
this.record.record();
}
/**
* Stop recording.
*/
stopRecording() {
this.recording = false;
this.record.stop(this.processRecording.bind(this));
}
/**
* processRecording Do what ever you want with blob
* @param  {any} blob Blog
*/
processRecording(blob) {
this.url = URL.createObjectURL(blob);
console.log("blob", blob);
console.log("url", this.url);
}
/**
* Process Error.
*/
errorCallback(error) {
this.error = 'Can not play audio in your browser';
}
ngOnInit() {}

}
