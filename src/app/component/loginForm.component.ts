import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../service/api.services';
import { Router } from '@angular/router';
import { StoreService } from '../service/localStore.services';
import { TimerSetDialog } from './settimerdialog.component';
import { WaitingDialog } from './waitingdialog.component';

/*
  Component to contain the login form.
*/
@Component({
  selector: 'loginForm',
  templateUrl: '../view/loginForm.component.html'
})
export class LoginFormComponent {
  // Local properties for binding to the template.
  loginForm: FormGroup;
  footer_message: string;

  timer_mode_active: boolean = false;
  timer_mode_color: string = "accent";

  profanity_filter_mode_active: boolean = false;
  profanity_filter_mode_color: string = "accent";
  profanity_filter_button_text: string = "face_6";
  
  // Constructor
  constructor( 
      private api: ApiService,
      public dialog: MatDialog,
      protected store: StoreService,
      private router: Router,
      private snackBar: MatSnackBar,
      public waitingDialog: MatDialog
    ) {
    this.loginForm = new FormGroup({});
    this.footer_message = store.MAD_LIBS_FOOTER;

    // Clear any persistant data from a previous login.
    store.setPlayerId("");
    store.setPlayerName("");
  }

  // Event: onInit append. Initiate the form.
  ngOnInit() : void {
    this.loginForm = new FormGroup({
      nickname: new FormControl('', [
        Validators.required
      ]),
      sessieid: new FormControl('')
    });
  }

  /*
    The onPlay event is called when the player wants to start playing the game. (click event)
    It posts the form to the backend, waits for a reply, stores the reply, then sends the player to the 
    game component to start their journey.
  */
  async onPlay() {
    if (this.loginForm.valid) {
      const dialogRef = this.waitingDialog.open(WaitingDialog, {
        width: '250px',
        data: {
          reason: "Waiting to join session"
        }
      });
      dialogRef.disableClose = true;

      this.store.setPlayerName(this.loginForm.value.nickname);
      let transmitForm = this.loginForm.value;
      transmitForm["playerid"] = "";
      transmitForm["sessieTimer"] = this.store.getTimeLimit();
      transmitForm["profanityFilter"] = this.profanity_filter_mode_active;      

      let joinGameState: any = {
        error: "game-in-progress"
      };
      while ((joinGameState.error !== undefined)
        && (joinGameState.error == "game-in-progress")) {
          try {
            await this.api.post(transmitForm, "gamestate").then((result) => {
              joinGameState = result;
            });
          } catch(exception) {
            this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
          }

          // Wait for one second after each request to prevent flooding the server.
          await new Promise(f => setTimeout(f, 1000));
      }
      this.store.setGameState(joinGameState);
      dialogRef.close();
      this.router.navigate(['game']);
    } else {
      this.snackBar.open("Please enter a nickname.", 'Alright', { duration: 5000 });
    }
  }

  /*
    Open the set timer dialog. 
  */
  openTimerDialog(): void {
    const dialogRef = this.dialog.open(TimerSetDialog, {
      width: '400px',
      data: { timeLimit: this.store.getTimeLimit() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.store.setTimeLimit(result);
      }

      if (this.store.getTimeLimit() == 0) {
        this.timer_mode_active = false;
        this.timer_mode_color = "accent";
      } else {
        this.timer_mode_active = true;
        this.timer_mode_color = "primary";
      }
    });
  }

  /*
    Switch on or off the profanity filter
  */
  switchProfanityMode() {
    this.profanity_filter_mode_active = !this.profanity_filter_mode_active;
    this.profanity_filter_mode_color = this.profanity_filter_mode_active ? "primary" : "accent";
    this.profanity_filter_button_text = this.profanity_filter_mode_active 
      ? "child_care" 
      : "face_6";
  }
}
