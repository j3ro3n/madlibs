import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './component/game.component';
import { HomeComponent } from './component/home.component';
import { VoteComponent } from './component/voting.component';

/*
  These routes show where the application will take you if you navigate to certain 'paths'.
*/
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'vote', component: VoteComponent }
];

/* 
  Declares the module used for routing through the app.
*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
