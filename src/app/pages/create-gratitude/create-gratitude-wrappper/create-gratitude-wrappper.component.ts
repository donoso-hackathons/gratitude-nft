import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'gratitude-wrappper',
  templateUrl: './create-gratitude-wrappper.component.html',
  styleUrls: ['./create-gratitude-wrappper.component.scss']
})
export class CreateGratitudeWrappperComponent implements OnInit {

  nftOptions:any[] = [  ,'photo', 'image' 
  ]
  nftOptionControl: FormControl = new FormControl('image')
  
  

  constructor() { }

  ngOnInit(): void {
  }

}
