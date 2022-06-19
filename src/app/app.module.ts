import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home.component';
import { GameComponent } from './component/game.component';
import { LoginFormComponent } from './component/loginForm.component';
import { TitleHeaderComponent } from './component/titleheader.component';
import { TimerSetDialog } from './component/settimerdialog.component';
import { VoteComponent } from './component/voting.component';
import { WaitingDialog } from './component/waitingdialog.component';

import { ApiService } from './service/api.services';
import { StoreService } from './service/localStore.services';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TimerService } from './service/timer.services';

/*
  Use the NgModule decorator to declare all the components required in the application.

  Warning, there be lots of 'em.
*/
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    LoginFormComponent,
    TimerSetDialog,
    TitleHeaderComponent,
    VoteComponent,
    WaitingDialog
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiService,
    HttpClient,
    StoreService,
    TimerService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor() {
    if (location.hostname !== "localhost") {
      enableProdMode();
    }
  }
}
