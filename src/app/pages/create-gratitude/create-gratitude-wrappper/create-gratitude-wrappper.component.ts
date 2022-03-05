import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'gratitude-wrappper',
  templateUrl: './create-gratitude-wrappper.component.html',
  styleUrls: ['./create-gratitude-wrappper.component.scss']
})
export class CreateGratitudeWrappperComponent implements OnInit {

  nftOptions:any[] = [ 'story', 'audio' ,'photo', 'image' , 'only-text'
  ]
  nftOptionControl: FormControl = new FormControl('photo')

  constructor() { }

  ngOnInit(): void {
  }

}
