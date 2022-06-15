import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../service/api.services';
import { Router } from '@angular/router';
import { StoreService } from '../service/localStore.services';

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
  
  // Constructor
  constructor(private snackBar: MatSnackBar, 
      private api: ApiService,
      private store: StoreService,
      private router: Router
    ) {
    this.loginForm = new FormGroup({});
    this.footer_message = store.MAD_LIBS_FOOTER;
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
      try {
        await this.api.postLogin(this.loginForm.value).then((result) => {
          this.store.setGameState(result);
        });
        this.router.navigate(['game']);
      } catch(exception) {
        let snackBarRef = this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
      }
    } else {
      let snackBarRef = this.snackBar.open("Please enter a nickname.", 'Sorry', { duration: 5000 });
    }
  }
}
