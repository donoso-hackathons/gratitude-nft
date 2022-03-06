import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { address_0 } from 'angular-web3';

import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject();
  commonForm: FormGroup;
  receiverOptions = [
    {
      id: 0,
      name: 'User Without Adress 0x'
    },
    {
      id: 1,
      name: 'User Wit Adress 0x'
    },
    {
      id: 2,
      name: 'Campaign'
    }]

  receiverOptionControl: FormControl = new FormControl(0)

  constructor(public formBuilder: FormBuilder) {
    this.commonForm = this.formBuilder.group({
      nameCtrl: ['', [Validators.required, Validators.maxLength(20)]],
      descriptionCtrl: [
        '', [Validators.maxLength(200)]
      ],
     // locationCtrl: [true],
      addressCtrl: ['']
    });

   // this.isLocationavailable()

    const len = address_0.length

    this.receiverOptionControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        console.log(value);
        if (value == 1) {
          this.commonForm.controls['addressCtrl'].setValidators([Validators.required, Validators.maxLength(len), Validators.minLength(len)])
        }


      })

  }


  isLocationavailable(){
    if (navigator.geolocation === undefined){
      this.commonForm.controls['locationCtrl'].setValue(false);
      this.commonForm.controls['locationCtrl'].disable()

    }
  }

  getCoords = ():Promise<{available:boolean, lng?:number, lat?:number}> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos)
        const coord = {
          available:true,
          lng: pos.coords.longitude,
          lat: pos.coords.latitude
        }
        resolve(coord)
      }), () => {
          resolve({available:false})
      };

    })
  }


  async getLocation() {
    if (navigator.geolocation == undefined) {
        return {availble:false}
    } else {
      const coords = await this.getCoords()
      return coords
  }
  }


  async doAsyncStaff(){

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
