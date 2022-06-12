import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../service/api.services';
import { Router } from '@angular/router';

@Component({
  selector: 'loginForm',
  templateUrl: '../view/loginForm.component.html'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  
  constructor(private snackBar: MatSnackBar, 
      private api: ApiService,
      private router: Router
    ) {
    this.loginForm = new FormGroup({});
  }

  ngOnInit() : void {
    this.loginForm = new FormGroup({
      nickname: new FormControl('', [
        Validators.required
      ]),
      sessieid: new FormControl('')
    });
  }

  async onPlay() {
    if (this.loginForm.valid) {
      try {
        await this.api.postLogin(this.loginForm);
        this.router.navigate(['game']);
      } catch(exception) {
        let snackBarRef = this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
      }
    } else {
      let snackBarRef = this.snackBar.open("Please enter a nickname.", 'Sorry', { duration: 5000 });
    }
  }
}
