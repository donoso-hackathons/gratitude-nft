import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit {
  commonForm: FormGroup;

  constructor( public formBuilder: FormBuilder) {
    this.commonForm = this.formBuilder.group({
      nameCtrl: ['', [Validators.required, Validators.maxLength(20)]],
      descriptionCtrl: [
        '', [ Validators.maxLength(200)]
      ],
      locationCtrl:[true]
    });

   }


   getLocation(){
    navigator.geolocation.getCurrentPosition(function(){
      alert('Location accessed')
},function(){
     alert('User not allowed')
},{timeout:10000})
   }

  ngOnInit(): void {
  }

}
