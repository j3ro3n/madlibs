import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from '../service/localStore.services';

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
  selector: 'dialog-overview-example-dialog',
  templateUrl: './../view/settimer.component.html',
})
export class TimerSetDialog {
  // Required field for display.
  protected formTimeLimit: number = 0;
  
  // Constructor
  constructor(
    public dialogRef: MatDialogRef<TimerSetDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TimerDialogData,
    private cd: ChangeDetectorRef,
    protected store: StoreService
  ) {}

  // Event: onInit append: Set the time limit to whatever it was set to earlier.
  ngOnInit() {
    this.formTimeLimit = this.store.getTimeLimit();
  }

  // Cancel the dialog: Set the timer to 0 (after all, the player 'no thanksed' to the question).
  onDialogCancel(): void {
    this.dialogRef.close(0);
  }

  // Confirm the dialog: Set the timer to whatever the value was.
  onDialogConfirm(timeLimitValue: number): void {
    this.dialogRef.close(timeLimitValue);
  }
}