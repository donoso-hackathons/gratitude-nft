import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  input_form:FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    // public dialogRef: MatDialogRef<TransactionComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.input_form = new FormGroup({
      to: new FormControl('',Validators.required),
      amount: new FormControl(0,[Validators.required, Validators.min(0.01)])
    });

  }
  doTransaction(){
    this.activeModal.close({...{type:'transaction'},...this.input_form.getRawValue()});
  }

  onNoClick(): void {
    this.activeModal.close({type:'cancel'});
  }
  ngOnInit(): void {
  }

}
