import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loginForm',
  templateUrl: '../view/loginForm.component.html'
})
export class LoginFormComponent {
    loginForm = new FormControl('');
}
