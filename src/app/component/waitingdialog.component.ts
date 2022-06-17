import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimerService } from '../service/timer.services';

/*
  Interface for objects used in Dialogs.
*/
export interface TimerDialogData {
  timeLimit: number;
}

/*
  This component holds the required code to show and handle the Timer Dialog.
*/
@Component({
  selector: 'dialog-waiting',
  templateUrl: './../view/waitingdialog.component.html',
})
export class WaitingDialog {
  // Required field for display.
  reason: string = "";
  
  // Constructor
  constructor(
    public dialogRef: MatDialogRef<WaitingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WaitingDialog,
    protected timer: TimerService
  ) {
    this.reason = data.reason;
  }
}